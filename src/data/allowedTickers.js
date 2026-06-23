export const allowedTickers = [
  "FIT", "TLH", "PVS", "PGB", "PVT", "IDJ", "SHS", "IDI", "TTF", "VCB",
  "IDC", "SZC", "VTP", "VCG", "VCI", "L14", "VCK", "HT1", "TCH", "LPB",
  "SHB", "PNJ", "AAA", "BSR", "TCM", "APS", "HHS", "TCB", "HHV", "TLG",
  "SAB", "C4G", "JVC", "MWG", "SIP", "POW", "SAM", "QNS", "FRT", "BSI",
  "DTD", "GEG", "GVR", "NVL", "TV2", "BCC", "HAG", "HSG", "HAH", "BCM",
  "GEX", "VJC", "QTP", "VEA", "BVH", "VIX", "HUT", "ASM", "BVS", "VDS",
  "ACB", "VRE", "CMG", "BMI", "PPC", "BVB", "BMP", "SSI", "FTS", "EVF",
  "KLB", "TCX", "CMX", "GMD", "YEG", "BFC", "FMC", "SSB", "NAB", "HTN",
  "LAS", "LHG", "VCS", "ABB", "CNG", "SBT", "CEO", "TDH", "PHR", "KDH",
  "VSC", "TDC", "CTR", "CTS", "KBC", "VGI", "NTC", "NKG", "VPB", "ORS",
  "LSS", "MBS", "VGC", "TPB", "VPI", "QCG", "MSH", "VPL", "OCB", "NT2",
  "FOX", "DXG", "NBC", "HDC", "SCR", "HDB", "ITC", "MBB", "DXS", "HDG",
  "MSN", "HPG", "MST", "VPX", "MSR", "CSV", "DGC", "GAS", "GIL", "PTB",
  "DPG", "SMC", "PC1", "MSB", "STB", "HVN", "CTG", "KSB", "LCG", "DDV",
  "DGW", "CTD", "DHC", "CTI", "VIP", "NVB", "BID", "TNG", "NDN", "VND",
  "DCM", "PET", "LDG", "VIC", "FCN", "MIG", "VNM", "IJC", "DPR", "VIB",
  "APG", "AGR", "D2D", "EIB", "DPM", "OIL", "AGG", "REE", "DRC", "ANV",
  "PLC", "NLG", "DBC", "VHM", "HCM", "DIG", "PDR", "PVC", "VHC", "PVD",
  "MHC", "CII", "KHG", "MPC", "FPT", "PLX", "VGS", "VOS", "SGB", "NTL",
  "HQC"
];

export const allowedTickerSet = new Set(allowedTickers);

export function isAllowedTicker(ticker) {
  return allowedTickerSet.has(String(ticker || "").trim().toUpperCase());
}