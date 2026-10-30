/* BBA listening papers – automatic marking by key ideas (v1, Oct 2026).
   Each item lists mark points; a point is scored when one of its
   alternatives is found, and an alternative is found when every group
   in it has at least one of its stems in the answer (accents ignored). */
(function(){
"use strict";
var KEY = JSON.parse(document.getElementById("lp-key").textContent);
function norm(t){
  return " " + String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")
    .replace(/[’`´]/g,"'").replace(/œ/g,"oe").replace(/\s+/g," ").trim() + " ";
}
function get(path){ return path.split(".").reduce(function(o,k){ return o==null?o:o[k]; }, KEY); }
function hit(text, alt){ return alt.every(function(g){ return g.some(function(st){ return text.indexOf(norm(st).trim())>=0; }); }); }
function scoreOpen(text, k, max){
  var t = norm(text); if(!t.trim()) return 0;
  var n = 0;
  k.pts.forEach(function(point){ if(point.some(function(alt){ return hit(t, alt); })) n++; });
  return Math.min(n, max);
}
function items(){ return Array.prototype.slice.call(document.querySelectorAll(".item[data-k]")); }
function feedbackFor(item){
  var nx = item.nextElementSibling;
  if (nx && nx.classList.contains("mark")) nx = nx.nextElementSibling;
  if (nx && nx.classList.contains("fb")) return nx;
  var fb = document.createElement("div"); fb.className = "fb";
  var anchor = item.nextElementSibling && item.nextElementSibling.classList.contains("mark") ? item.nextElementSibling : item;
  anchor.insertAdjacentElement("afterend", fb);
  return fb;
}
var RESULT = null;
function mark(){
  var rows = [], total = 0;
  items().forEach(function(item){
    var path = item.dataset.k, max = +item.dataset.max, given, got, model;
    if (path.indexOf("q1.") === 0){
      var i = +path.split(".")[1], want = KEY.q1[i];
      given = item.querySelector(".mcval").value;
      got = (given === want) ? 1 : 0; model = want;
      item.querySelectorAll(".opt").forEach(function(b){ b.classList.toggle("right", b.dataset.v === want); });
    } else {
      var k = get(path);
      given = item.querySelector("textarea").value;
      got = scoreOpen(given, k, max); model = k.ans;
    }
    total += got;
    rows.push({lab:item.dataset.lab, given:given, got:got, max:max, model:model});
    var fb = feedbackFor(item);
    fb.className = "fb " + (got===max ? "full" : got>0 ? "part" : "zero");
    fb.innerHTML = "<b>" + got + " / " + max + "</b>" + (given.trim() ? "" : "No answer. ") +
      (got===max && path.indexOf("q1.")===0 ? "" : "Mark scheme: " + esc(model));
  });
  document.body.classList.add("locked");
  document.querySelectorAll("textarea.ans").forEach(function(t){ if(!t.closest(".defi")) t.readOnly = true; });
  var res = document.getElementById("lp-res");
  var by = function(p){ return rows.filter(function(r){ return r.lab.indexOf(p)===0; }).reduce(function(a,r){ return a+r.got; },0); };
  res.hidden = false;
  res.innerHTML = "<p><b>Your mark: " + total + " / 30</b></p>" +
    "<p>Question 1: " + by("1(") + "/4 · Question 2: " + by("2(") + "/5 · Question 3: " + by("3(") + "/9 · Question 4: " + (by("4(a)")+by("4(b)")) + "/12</p>" +
    "<p>The computer marks key ideas, so it can miss an answer that means the same thing. Read each mark-scheme line under your answers; if you think yours deserves the mark, tell your teacher.</p>";
  RESULT = {rows:rows, total:total};
  publish(total, 30, rows.filter(function(r){ return String(r.given||"").trim(); }).length);
  return RESULT;
}
/* same record the activity kit writes, so the hub tile and the Progress code show the mark */
function publish(scored, total, answered){
  try{
    var all = JSON.parse(localStorage.getItem("bba-scores") || "{}");
    var f = decodeURIComponent(location.pathname.split("/").pop() || "index");
    var prev = all[f] || {};
    var rec = all[f] = { title:(document.title||"").slice(0,120), score:scored, total:total,
      best: Math.max(scored/total, prev.best || 0), attempts:(prev.attempts||0)+1, t:Date.now() };
    rec.ans = (prev.ans||0) + answered;
    rec.lg = {}; for (var k in (prev.lg||{})) rec.lg[k] = prev.lg[k];
    var day = String(Math.floor(Date.now()/86400000)); if (answered) rec.lg[day] = (rec.lg[day]||0) + answered;
    localStorage.setItem("bba-scores", JSON.stringify(all));
  }catch(e){}
}
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function csv(v){ return '"' + String(v==null?"":v).replace(/"/g,'""').replace(/\r?\n/g," ") + '"'; }
function download(){
  var R = RESULT || mark();
  var name = (document.getElementById("cand").value || "").trim();
  var title = document.title.replace(/[\\\/:*?"<>|]/g,"-");
  var d = new Date(), p2 = function(n){ return (n<10?"0":"")+n; };
  var stamp = d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate());
  var L = [[ "Student", name || "(no name)" ],[ "Paper", title ],[ "Date", stamp+" "+p2(d.getHours())+":"+p2(d.getMinutes()) ],
           [ "Mark (automatic)", R.total+" / 30" ],[],[ "Question","Answer","Mark","Out of","Mark scheme" ]].map(function(r){ return r.map(csv).join(","); });
  R.rows.forEach(function(r){ L.push([r.lab, r.given, r.got, r.max, r.model].map(csv).join(",")); });
  var defi = document.querySelectorAll(".defi textarea");
  if (defi.length){ L.push(""); L.push(csv("Défi (not marked)")); defi.forEach(function(t,i){ if(t.value.trim()) L.push([ "Défi "+(i+1), t.value ].map(csv).join(",")); }); }
  var blob = new Blob(["﻿"+L.join("\r\n")], {type:"text/csv;charset=utf-8;"});
  var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = (name ? name+" - " : "") + title + " - " + stamp + ".csv";
  document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 0);
}
function reset(){
  if (!confirmReset()) return;
  document.querySelectorAll("textarea.ans").forEach(function(t){ t.readOnly=false; t.value=""; t.dispatchEvent(new Event("input",{bubbles:true})); });
  document.querySelectorAll(".mcval").forEach(function(f){ f.value=""; f.dispatchEvent(new Event("input",{bubbles:true})); });
  document.querySelectorAll(".fb").forEach(function(f){ f.remove(); });
  document.querySelectorAll(".opt.right").forEach(function(b){ b.classList.remove("right"); });
  document.body.classList.remove("locked"); document.getElementById("lp-res").hidden = true; RESULT = null;
  window.scrollTo(0,0);
}
var armed = 0;
function confirmReset(){
  var b = document.getElementById("lp-reset");
  if (armed && Date.now()-armed < 4000){ armed = 0; b.textContent = "Start again"; return true; }
  armed = Date.now(); b.textContent = "Click again to clear all answers"; 
  setTimeout(function(){ if(armed){ armed=0; b.textContent="Start again"; } }, 4000);
  return false;
}
document.getElementById("lp-mark").addEventListener("click", function(){ mark(); document.getElementById("lp-res").scrollIntoView({behavior:"smooth",block:"center"}); });
document.getElementById("lp-dl").addEventListener("click", download);
document.getElementById("lp-reset").addEventListener("click", reset);
window.LPMark = {norm:norm, scoreOpen:scoreOpen, get:get, mark:mark};
})();
