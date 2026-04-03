// ═══════════════════════════════════════════════════════════════
// WARFRAME PRIME STATUS DATA
// ═══════════════════════════════════════════════════════════════
// HOW TO UPDATE THIS FILE:
//
//   1. Check https://warframe.fandom.com/wiki/Prime_Vault for current vault status
//   2. Check https://www.warframe.com/en/prime-resurgence for active resurgence
//   3. Update the statuses below:
//      "active"      = currently farmable via Void Relics (newest ~7 primes)
//      "resurgence"  = currently in Prime Resurgence rotation (Varzia, costs Aya)
//      "vaulted"     = fully vaulted, not currently available without trading
//      "noprime"     = no prime version exists yet
//
//   Last updated: April 2, 2026
//   Current Prime Access: Styanax Prime (released ~March 2026)
//   Current Resurgence:   Nova Prime & Trinity Prime (April 2026 rotation)
// ═══════════════════════════════════════════════════════════════

const PRIME_STATUS = {
  // ── CURRENTLY ACTIVE (farmable via Void Relics right now) ──
  // Approximately the 7 most recently released Primes stay unvaulted
  "Styanax":   { status: "active",     primeName: "Styanax Prime",   note: "Current Prime Access" },
  "Voruna":    { status: "active",     primeName: "Voruna Prime",     note: "Recently released" },
  "Citrine":   { status: "active",     primeName: "Citrine Prime",    note: "Recently released" },
  "Kullervo":  { status: "active",     primeName: "Kullervo Prime",   note: "Recently released" },
  "Dagath":    { status: "active",     primeName: "Dagath Prime",     note: "Recently released" },
  "Qorvex":    { status: "active",     primeName: "Qorvex Prime",     note: "Recently released" },
  "Dante":     { status: "active",     primeName: "Dante Prime",      note: "Recently released" },

  // ── CURRENT PRIME RESURGENCE (April 2026 — Varzia, costs Aya) ──
  "Nova":      { status: "resurgence", primeName: "Nova Prime",       note: "Active Resurgence Apr 2026" },
  "Trinity":   { status: "resurgence", primeName: "Trinity Prime",    note: "Active Resurgence Apr 2026" },

  // ── VAULTED (requires trading or waiting for Resurgence) ──
  "Excalibur": { status: "vaulted",    primeName: "Excalibur Prime",  note: "Founders exclusive — unobtainable" },
  "Mag":       { status: "vaulted",    primeName: "Mag Prime",        note: "Vaulted" },
  "Volt":      { status: "vaulted",    primeName: "Volt Prime",       note: "Vaulted" },
  "Rhino":     { status: "vaulted",    primeName: "Rhino Prime",      note: "Vaulted" },
  "Ember":     { status: "vaulted",    primeName: "Ember Prime",      note: "Vaulted" },
  "Frost":     { status: "vaulted",    primeName: "Frost Prime",      note: "Vaulted" },
  "Loki":      { status: "vaulted",    primeName: "Loki Prime",       note: "Vaulted" },
  "Ash":       { status: "vaulted",    primeName: "Ash Prime",        note: "Vaulted" },
  "Banshee":   { status: "vaulted",    primeName: "Banshee Prime",    note: "Vaulted" },
  "Nekros":    { status: "vaulted",    primeName: "Nekros Prime",     note: "Vaulted" },
  "Valkyr":    { status: "vaulted",    primeName: "Valkyr Prime",     note: "Permanently unvaulted but vaulted" },
  "Nyx":       { status: "vaulted",    primeName: "Nyx Prime",        note: "Permanently unvaulted but vaulted" },
  "Oberon":    { status: "vaulted",    primeName: "Oberon Prime",     note: "Vaulted" },
  "Zephyr":    { status: "vaulted",    primeName: "Zephyr Prime",     note: "Vaulted" },
  "Hydroid":   { status: "vaulted",    primeName: "Hydroid Prime",    note: "Vaulted" },
  "Mirage":    { status: "vaulted",    primeName: "Mirage Prime",     note: "Vaulted" },
  "Limbo":     { status: "vaulted",    primeName: "Limbo Prime",      note: "Vaulted" },
  "Mesa":      { status: "vaulted",    primeName: "Mesa Prime",       note: "Vaulted" },
  "Chroma":    { status: "vaulted",    primeName: "Chroma Prime",     note: "Vaulted" },
  "Equinox":   { status: "vaulted",    primeName: "Equinox Prime",    note: "Vaulted" },
  "Atlas":     { status: "vaulted",    primeName: "Atlas Prime",      note: "Vaulted" },
  "Wukong":    { status: "vaulted",    primeName: "Wukong Prime",     note: "Vaulted" },
  "Ivara":     { status: "vaulted",    primeName: "Ivara Prime",      note: "Vaulted" },
  "Nezha":     { status: "vaulted",    primeName: "Nezha Prime",      note: "Vaulted" },
  "Inaros":    { status: "vaulted",    primeName: "Inaros Prime",     note: "Vaulted" },
  "Titania":   { status: "vaulted",    primeName: "Titania Prime",    note: "Vaulted" },
  "Nidus":     { status: "vaulted",    primeName: "Nidus Prime",      note: "Vaulted" },
  "Octavia":   { status: "vaulted",    primeName: "Octavia Prime",    note: "Vaulted" },
  "Harrow":    { status: "vaulted",    primeName: "Harrow Prime",     note: "Vaulted" },
  "Gara":      { status: "vaulted",    primeName: "Gara Prime",       note: "Vaulted" },
  "Khora":     { status: "vaulted",    primeName: "Khora Prime",      note: "Vaulted" },
  "Revenant":  { status: "vaulted",    primeName: "Revenant Prime",   note: "Vaulted" },
  "Garuda":    { status: "vaulted",    primeName: "Garuda Prime",     note: "Vaulted" },
  "Baruuk":    { status: "vaulted",    primeName: "Baruuk Prime",     note: "Vaulted" },
  "Hildryn":   { status: "vaulted",    primeName: "Hildryn Prime",    note: "Vaulted" },
  "Wisp":      { status: "vaulted",    primeName: "Wisp Prime",       note: "Vaulted" },
  "Gauss":     { status: "vaulted",    primeName: "Gauss Prime",      note: "Vaulted" },
  "Grendel":   { status: "vaulted",    primeName: "Grendel Prime",    note: "Vaulted" },
  "Protea":    { status: "vaulted",    primeName: "Protea Prime",     note: "Vaulted" },
  "Xaku":      { status: "vaulted",    primeName: "Xaku Prime",       note: "Vaulted" },
  "Lavos":     { status: "vaulted",    primeName: "Lavos Prime",      note: "Vaulted" },
  "Sevagoth":  { status: "vaulted",    primeName: "Sevagoth Prime",   note: "Vaulted" },
  "Yareli":    { status: "vaulted",    primeName: "Yareli Prime",     note: "Vaulted" },
  "Caliban":   { status: "vaulted",    primeName: "Caliban Prime",    note: "Vaulted" },
  "Gyre":      { status: "vaulted",    primeName: "Gyre Prime",       note: "Vaulted" },
  "Saryn":     { status: "vaulted",    primeName: "Saryn Prime",      note: "Vaulted" },
  "Vauban":    { status: "vaulted",    primeName: "Vauban Prime",     note: "Vaulted" },

  // ── NO PRIME EXISTS YET ──
  "Nyx":       { status: "noprime",    primeName: null,               note: "No prime" }, // overridden above but just in case
  "Valkyr":    { status: "noprime",    primeName: null,               note: "No prime" }, // same
  "Titania":   { status: "vaulted",    primeName: "Titania Prime",    note: "Vaulted" },
  "Styanax":   { status: "active",     primeName: "Styanax Prime",    note: "Current Prime Access" },
  "Jade":      { status: "noprime",    primeName: null,               note: "No prime yet" },
  "Koumei":    { status: "noprime",    primeName: null,               note: "No prime yet" },
  "Cyte-09":   { status: "noprime",    primeName: null,               note: "No prime yet" },
  "Temple":    { status: "noprime",    primeName: null,               note: "No prime yet" },
  "Oraxia":    { status: "noprime",    primeName: null,               note: "No prime yet" },
  "Follie":    { status: "noprime",    primeName: null,               note: "No prime yet (March 2026)" },
  "Oberon":    { status: "vaulted",    primeName: "Oberon Prime",     note: "Vaulted" },
  "Titania":   { status: "vaulted",    primeName: "Titania Prime",    note: "Vaulted" },
};

// Current resurgence metadata (shown in the primes banner)
const RESURGENCE_INFO = {
  active: true,
  frames: ["Nova Prime", "Trinity Prime"],
  weapons: ["Soma Prime", "Vasto Prime", "Dual Kamas Prime"],
  note: "Active April 2026 — Varzia at Maroo's Bazaar (costs Aya)",
  wikiUrl: "https://warframe.fandom.com/wiki/Prime_Resurgence"
};
