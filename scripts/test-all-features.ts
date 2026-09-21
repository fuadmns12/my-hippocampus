/**
 * Test Suite: Validasi Seluruh Fitur My Hippocampus
 * Menjalankan pengujian otomatis unit dan fungsional terhadap semua modul inti.
 */

import { parseNames, buildMindMapData } from "../src/utils/mindMapTreeBuilder";
import { PRESET_TEMPLATES, getPresetById, SPECIFIC_PRESETS, GENERAL_PRESETS } from "../src/data/presets";
import { computeMindMapPositions } from "../src/utils/mindmapLayout";
import { generateMindMapFromPreset } from "../src/utils/documentHelper";
import { ColorTheme, GroupingStrategy, MindMapLayout, CustomGroupingConfig } from "../src/types";
import { THEME_PALETTES, getThemePalette } from "../src/utils/colorThemes";
import fs from "fs";
import path from "path";

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
  }
}

const DEFAULT_TEST_CFG: CustomGroupingConfig = {
  alphabetMode: "range",
  alphabetRanges: "A-G, H-M, N-S, T-Z",
  alphabetNumGroups: 4,
  alphabetIncludeOthers: true,
  balancedBranchCount: 4,
  balancedBranchPrefix: "Kelompok",
  balancedDistributionMode: "round-robin",
  flatEmoji: "👤",
  flatSortOrder: "original",
};

async function runTestSuite() {
  console.log("=================================================");
  console.log("🚀 MEMULAI PENGUJIAN SEMUA FITUR MY HIPPOCAMPUS");
  console.log("=================================================\n");

  // ----------------------------------------------------
  // TEST SUITE 1: Parsing & Pemrosesan Nama Input
  // ----------------------------------------------------
  console.log("📦 [1/8] Pengujian Parsing Nama & List Input:");
  const testInput1 = "Ahmad Dani\nBudi Santoso\nCitra Dewi, Doni Pratama\n\n   Eko Prasetyo   ";
  const parsed = parseNames(testInput1);
  assert(parsed.length === 5, "parseNames memisahkan baris baru dan koma secara akurat");
  assert(parsed[0] === "Ahmad Dani", "Nama pertama bersih tanpa spasi liar");
  assert(parsed[4] === "Eko Prasetyo", "Nama terakhir berhasil di-trim");
  assert(parseNames("").length === 0, "String kosong menghasilkan array kosong");

  // ----------------------------------------------------
  // TEST SUITE 2: Grouping Strategies & Tree Builder
  // ----------------------------------------------------
  console.log("\n🌳 [2/8] Pengujian Tree Builder & Strategi Pengelompokan:");
  const names = [
    "Alice", "Bob", "Charlie", "David", "Eve", 
    "Frank", "Grace", "Heidi", "Ivan", "Judy",
    "Kevin", "Laura", "Mallory", "Niaj", "Olivia"
  ];

  const strategies: GroupingStrategy[] = ["alphabetical", "balanced-spokes", "flat-direct"];
  for (const strat of strategies) {
    const mapData = buildMindMapData({
      topicTitle: `Test Topik ${strat}`,
      topicSubtitle: "Subtitle Test",
      namesList: names,
      strategy: strat,
      cfg: DEFAULT_TEST_CFG,
      layout: "radial",
      theme: "my-version",
      connectorStyle: "bezier",
      nodeShape: "rounded",
      currentFolder: "Umum",
    });

    assert(Boolean(mapData.root), `Pohon berhasil dibuat untuk strategi [${strat}]`);
    assert(mapData.root.children.length > 0, `Strategi [${strat}] menghasilkan cabang anak`);
    assert(mapData.folder === "Umum", `Folder tersimpan dengan benar sebagai 'Umum'`);
    assert(mapData.root.label === `Test Topik ${strat}`, `Label root sesuai parameter`);
  }

  // Pengujian Spesifik Folder
  const specificMap = buildMindMapData({
    topicTitle: "Arsitektur Backend",
    topicSubtitle: "Node.js Microservices",
    namesList: ["Auth Service", "Billing Service", "Sync Worker"],
    strategy: "alphabetical",
    cfg: DEFAULT_TEST_CFG,
    layout: "horizontal-tree",
    theme: "neon-dark",
    connectorStyle: "straight",
    nodeShape: "pill",
    currentFolder: "Spesifik",
  });
  assert(specificMap.folder === "Spesifik", "Folder 'Spesifik' tervalidasi dengan benar");

  // ----------------------------------------------------
  // TEST SUITE 3: Presets & Template Integritas
  // ----------------------------------------------------
  console.log("\n📋 [3/8] Pengujian Integritas Template Preset:");
  assert(PRESET_TEMPLATES.length >= 6, `Terdapat minimal 6 preset (${PRESET_TEMPLATES.length} terdeteksi)`);
  assert(SPECIFIC_PRESETS.length > 0, "Koleksi preset kategori Spesifik terisi");
  assert(GENERAL_PRESETS.length > 0, "Koleksi preset kategori Umum terisi");

  for (const preset of PRESET_TEMPLATES) {
    assert(typeof preset.id === "string" && preset.id.length > 0, `Preset [${preset.id}] memiliki ID unik`);
    assert(typeof preset.title === "string" && preset.title.length > 0, `Preset [${preset.id}] memiliki judul tampilan`);
    assert(preset.folder === "Umum" || preset.folder === "Spesifik", `Preset [${preset.id}] memiliki folder valid: ${preset.folder}`);
    assert(Array.isArray(preset.names) && preset.names.length > 0, `Preset [${preset.id}] memiliki daftar anggota valid (${preset.names.length} nama)`);

    // Validasi generate preset ke MindMapData
    const generated = generateMindMapFromPreset(preset);
    assert(generated.root.children.length > 0, `Preset [${preset.id}] sukses dibangun menjadi mindmap visual (${generated.root.children.length} cabang)`);
  }

  const lookup = getPresetById("tech-team");
  assert(lookup !== undefined && lookup.id === "tech-team", "Helper getPresetById berfungsi mencari preset");

  // ----------------------------------------------------
  // TEST SUITE 4: Layout Matrix & Koordinat Node
  // ----------------------------------------------------
  console.log("\n📐 [4/8] Pengujian Kalkulasi Tata Letak (Layouts):");
  const layouts: MindMapLayout[] = [
    "radial",
    "horizontal-tree",
    "vertical-tree",
    "fishbone",
    "bubble-cluster",
    "bilateral-bracket",
    "grid-network",
  ];

  const sampleTree = buildMindMapData({
    topicTitle: "Root Layout Test",
    topicSubtitle: "Kalkulasi Geometri",
    namesList: ["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"],
    strategy: "balanced-spokes",
    cfg: DEFAULT_TEST_CFG,
    layout: "radial",
    theme: "my-version",
    connectorStyle: "bezier",
    nodeShape: "rounded",
    currentFolder: "Umum",
  }).root;

  for (const lay of layouts) {
    const layoutResult = computeMindMapPositions(sampleTree, lay);
    assert(Boolean(layoutResult && layoutResult.nodes.length > 0), `Kalkulasi tata letak layout [${lay}] menghasilkan node terposisi`);
    assert(Array.isArray(layoutResult.links) && layoutResult.links.length > 0, `Kalkulasi tata letak layout [${lay}] menghasilkan link path SVG`);
    
    // Verifikasi semua node memiliki koordinat finite
    let allCoordinatesValid = true;
    for (const node of layoutResult.nodes) {
      if (Number.isNaN(node.x) || Number.isNaN(node.y) || !Number.isFinite(node.x) || !Number.isFinite(node.y)) {
        allCoordinatesValid = false;
        break;
      }
    }
    assert(allCoordinatesValid, `Semua node pada layout [${lay}] memiliki koordinat geometris terdefinisi`);
  }

  // ----------------------------------------------------
  // TEST SUITE 5: Palet Warna & Tema
  // ----------------------------------------------------
  console.log("\n🎨 [5/8] Pengujian Tema & Palet Warna (Color Themes):");
  const themeKeys = Object.keys(THEME_PALETTES);
  assert(themeKeys.length >= 7, `Terdapat minimal 7 tema palet (${themeKeys.length} terdaftar)`);
  assert(themeKeys.includes("my-version"), "Tema 'my-version' (Cyber Neon default) tersedia");
  assert(themeKeys.includes("neon-dark"), "Tema 'neon-dark' tersedia");
  assert(themeKeys.includes("pastel"), "Tema 'pastel' (Light mode) tersedia");

  for (const tKey of themeKeys) {
    const t = getThemePalette(tKey as ColorTheme);
    assert(Boolean(t && t.name && t.branchColors && t.branchColors.length > 0), `Tema [${tKey}] memiliki palet cabang valid (${t.name})`);
  }

  // ----------------------------------------------------
  // TEST SUITE 6: CSS & Saklar Uiverse (NeoToggle & Rocker)
  // ----------------------------------------------------
  console.log("\n⚙️ [6/8] Pengujian Komponen Saklar & Styling CSS:");
  const cssPath = path.join(process.cwd(), "src", "index.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  assert(cssContent.includes(".neo-toggle-container"), "CSS class '.neo-toggle-container' terdaftar");
  assert(cssContent.includes("--toggle-on-color: #06b6d4"), "Warna aktif NeoToggle menggunakan Neon Cyan (#06b6d4)");
  assert(cssContent.includes(".ui-rocker-switch"), "CSS class '.ui-rocker-switch' untuk tema terdaftar");
  assert(cssContent.includes(".neo-spectrum-analyzer"), "Animasi spektrum audio mikro NeoToggle aktif di CSS");

  // Validasi file komponen NeoToggle.tsx
  const neoToggleComponentPath = path.join(process.cwd(), "src", "components", "common", "NeoToggle.tsx");
  assert(fs.existsSync(neoToggleComponentPath), "Komponen NeoToggle.tsx terbuat dan terisolasi dengan rapi");

  // ----------------------------------------------------
  // TEST SUITE 7: Server Routes & PWA Service Worker
  // ----------------------------------------------------
  console.log("\n🌐 [7/8] Pengujian Server Endpoints & PWA Offline:");
  const serverPath = path.join(process.cwd(), "server.ts");
  const serverContent = fs.readFileSync(serverPath, "utf-8");
  assert(serverContent.includes("app.listen(PORT, \"0.0.0.0\""), "Dev server mengikat ke host 0.0.0.0 port 3000");

  const routesPath = path.join(process.cwd(), "server", "routes", "systemRoutes.ts");
  const routesContent = fs.readFileSync(routesPath, "utf-8");
  assert(routesContent.includes("/api/health"), "Endpoint /api/health tersedia");
  assert(routesContent.includes("/sw.js"), "Route service worker /sw.js tersedia untuk PWA");

  // ----------------------------------------------------
  // TEST SUITE 8: JSON & Format Ekspor
  // ----------------------------------------------------
  console.log("\n💾 [8/8] Pengujian Format Simpan & Serialisasi:");
  const testSaveData = buildMindMapData({
    topicTitle: "Export Serialization Test",
    topicSubtitle: "Persistence Testing",
    namesList: ["Item 1", "Item 2"],
    strategy: "balanced-spokes",
    cfg: DEFAULT_TEST_CFG,
    layout: "radial",
    theme: "my-version",
    connectorStyle: "bezier",
    nodeShape: "rounded",
    currentFolder: "Umum",
  });

  const serialized = JSON.stringify(testSaveData);
  assert(typeof serialized === "string" && serialized.length > 50, "Serialisasi data mindmap ke JSON berhasil");
  const parsedBack = JSON.parse(serialized);
  assert(parsedBack.root.label === "Export Serialization Test", "Deserialisasi JSON mempertahankan struktur data asli");

  // ----------------------------------------------------
  // HASIL PENGUJIAN
  // ----------------------------------------------------
  console.log("\n=================================================");
  console.log(`🏁 HASIL AKHIR: ${passedTests} LULUS, ${failedTests} GAGAL`);
  console.log("=================================================");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Fatal Test Execution Error:", err);
  process.exit(1);
});
