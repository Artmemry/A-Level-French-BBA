/* =====================================================================
   BBA XLSX — write a real Excel workbook in the browser, no library.

   The dashboard exports to .xlsx because the department lives in M365 and
   a CSV means re-formatting a class list every time you want to look at
   it. An .xlsx opens with headers frozen, columns sized, and percentages
   already banded.

   A .xlsx is a zip of XML. This writes the zip with STORED entries — no
   compression, so no deflate implementation — which Excel, LibreOffice
   and Numbers all open. A class of thirty comes to a few tens of kB.

       BBAXlsx.download('marks.xlsx', [
         { name: 'Class summary',
           columns: [{header:'Student', width:26}, {header:'Average', width:12, type:'percent'}],
           rows: [ ['Sophie K.', 0.78], … ] }
       ]);

   Cell values: a string, a number, null, or {v: value, band: 'hi'|'mid'|'lo'}.
   ===================================================================== */
(function () {
"use strict";
if (window.BBAXlsx) return;

/* ------------------------------------------------------------- crc32 */
var TABLE = (function () {
  var t = new Uint32Array(256), c, n, k;
  for (n = 0; n < 256; n++) {
    c = n;
    for (k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  var c = 0xFFFFFFFF, i;
  for (i = 0; i < bytes.length; i++) c = TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function utf8(str) {
  var out = [], i, c;
  str = String(str == null ? '' : str);
  for (i = 0; i < str.length; i++) {
    c = str.codePointAt(i);
    if (c > 0xFFFF) i++;
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xC0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else out.push(0xF0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return new Uint8Array(out);
}
function xmlEscape(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');     // Excel rejects these
}

/* --------------------------------------------------------------- zip */
function zip(files) {
  var parts = [], central = [], offset = 0;

  function push(arr) { parts.push(arr); offset += arr.length; }
  function u16(n) { return [n & 255, (n >> 8) & 255]; }
  function u32(n) { return [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255]; }

  files.forEach(function (f) {
    var name = utf8(f.name), data = utf8(f.data), crc = crc32(data);
    var start = offset;
    var header = [].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
                           u32(crc), u32(data.length), u32(data.length),
                           u16(name.length), u16(0));
    push(new Uint8Array(header));
    push(name);
    push(data);
    central.push({ name: name, crc: crc, size: data.length, start: start });
  });

  var dirStart = offset;
  central.forEach(function (e) {
    var rec = [].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
                        u32(e.crc), u32(e.size), u32(e.size),
                        u16(e.name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(e.start));
    push(new Uint8Array(rec));
    push(e.name);
  });
  var dirSize = offset - dirStart;
  push(new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0),
                                u16(central.length), u16(central.length),
                                u32(dirSize), u32(dirStart), u16(0))));

  var total = parts.reduce(function (a, p) { return a + p.length; }, 0);
  var out = new Uint8Array(total), at = 0;
  parts.forEach(function (p) { out.set(p, at); at += p.length; });
  return out;
}

/* ------------------------------------------------------------ sheets */
function colName(i) {
  var s = '';
  i += 1;
  while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = (i - m - 1) / 26; }
  return s;
}

/* Style ids, in the order they are written into styles.xml below. */
var S_DEFAULT = 0, S_HEAD = 1, S_PCT = 2, S_PCT_HI = 3, S_PCT_MID = 4, S_PCT_LO = 5,
    S_DATE = 6, S_NAME = 7, S_MUTED = 8;

function styles() {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="2">' +
      '<numFmt numFmtId="164" formatCode="0%"/>' +
      '<numFmt numFmtId="165" formatCode="dd/mm/yyyy"/>' +
    '</numFmts>' +
    '<fonts count="4">' +
      '<font><sz val="11"/><name val="Calibri"/></font>' +
      '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>' +
      '<font><b/><sz val="11"/><name val="Calibri"/></font>' +
      '<font><sz val="11"/><color rgb="FF8A8F9E"/><name val="Calibri"/></font>' +
    '</fonts>' +
    '<fills count="6">' +
      '<fill><patternFill patternType="none"/></fill>' +
      '<fill><patternFill patternType="gray125"/></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FF1F3A6E"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFE8F3ED"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFFCF3DF"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFFBEDEF"/><bgColor indexed="64"/></patternFill></fill>' +
    '</fills>' +
    '<borders count="2">' +
      '<border><left/><right/><top/><bottom/><diagonal/></border>' +
      '<border><left/><right/><top/><bottom style="thin"><color rgb="FFCFD8E6"/></bottom><diagonal/></border>' +
    '</borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="9">' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +                                    // default
      '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1">' +
        '<alignment vertical="center" wrapText="1"/></xf>' +                                                // header
      '<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1"/>' +            // percent
      '<xf numFmtId="164" fontId="0" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1"/>' +
      '<xf numFmtId="164" fontId="0" fillId="4" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1"/>' +
      '<xf numFmtId="164" fontId="0" fillId="5" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1"/>' +
      '<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1"/>' +            // date
      '<xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1"/>' +                      // name
      '<xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1"/>' +                      // muted
    '</cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '</styleSheet>';
}

function cell(ref, value, colDef) {
  var band = null;
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    band = value.band || null;
    value = value.v;
  }
  if (value === null || value === undefined || value === '') return '';

  var type = colDef && colDef.type;
  if (type === 'percent' && typeof value === 'number') {
    var st = band === 'hi' ? S_PCT_HI : band === 'mid' ? S_PCT_MID : band === 'lo' ? S_PCT_LO : S_PCT;
    return '<c r="' + ref + '" s="' + st + '"><v>' + value + '</v></c>';
  }
  if (typeof value === 'number' && isFinite(value)) {
    return '<c r="' + ref + '" s="' + S_DEFAULT + '"><v>' + value + '</v></c>';
  }
  var st2 = type === 'name' ? S_NAME : type === 'muted' ? S_MUTED : S_DEFAULT;
  return '<c r="' + ref + '" s="' + st2 + '" t="inlineStr"><is><t xml:space="preserve">' +
         xmlEscape(value) + '</t></is></c>';
}

function sheetXml(sheet) {
  var cols = sheet.columns || [];
  var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';

  if (cols.length) {
    xml += '<cols>';
    cols.forEach(function (c, i) {
      xml += '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + (c.width || 14) + '" customWidth="1"/>';
    });
    xml += '</cols>';
  }
  xml += '<sheetData>';

  if (cols.length) {
    xml += '<row r="1" ht="30" customHeight="1">';
    cols.forEach(function (c, i) {
      xml += '<c r="' + colName(i) + '1" s="' + S_HEAD + '" t="inlineStr"><is><t>' +
             xmlEscape(c.header) + '</t></is></c>';
    });
    xml += '</row>';
  }
  (sheet.rows || []).forEach(function (row, r) {
    var n = r + 2;
    xml += '<row r="' + n + '">';
    row.forEach(function (v, i) { xml += cell(colName(i) + n, v, cols[i]); });
    xml += '</row>';
  });
  xml += '</sheetData>';
  /* Freeze the header, and the first column where there is one worth freezing. */
  xml = xml.replace('<sheetData>',
    '<sheetViews><sheetView workbookViewId="0">' +
    '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>' +
    '</sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/><sheetData>');
  if (cols.length && (sheet.rows || []).length) {
    xml += '<autoFilter ref="A1:' + colName(cols.length - 1) + ((sheet.rows || []).length + 1) + '"/>';
  }
  xml += '</worksheet>';
  return xml;
}

function build(sheets) {
  var files = [];
  var names = sheets.map(function (s, i) { return (s.name || ('Sheet' + (i + 1))).slice(0, 31).replace(/[\\\/\?\*\[\]:]/g, ' '); });

  files.push({ name: '[Content_Types].xml', data:
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
    sheets.map(function (s, i) {
      return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
    }).join('') + '</Types>' });

  files.push({ name: '_rels/.rels', data:
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
    '</Relationships>' });

  files.push({ name: 'xl/workbook.xml', data:
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
    names.map(function (n, i) {
      return '<sheet name="' + xmlEscape(n) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>';
    }).join('') + '</sheets></workbook>' });

  files.push({ name: 'xl/_rels/workbook.xml.rels', data:
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    sheets.map(function (s, i) {
      return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>';
    }).join('') +
    '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
    '</Relationships>' });

  files.push({ name: 'xl/styles.xml', data: styles() });
  sheets.forEach(function (s, i) {
    files.push({ name: 'xl/worksheets/sheet' + (i + 1) + '.xml', data: sheetXml(s) });
  });
  return zip(files);
}

function download(filename, sheets) {
  var bytes = build(sheets);
  var blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = /\.xlsx$/i.test(filename) ? filename : filename + '.xlsx';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
}

window.BBAXlsx = { build: build, download: download, version: 1 };
})();
