const IS_INTRANET = false
const colors: any = {
  "rain": {
    r: [167, 61, 92, 0, 249, 80],
    g: [239, 166, 185, 1, 5, 2],
    b: [140, 7, 253, 250, 241, 0],
    v: [0.1, 1.6, 7, 15, 40, 50],
  },
  "pre_1": {
    r: [167, 61, 92, 0, 249, 80],
    g: [239, 166, 185, 1, 5, 2],
    b: [140, 7, 253, 250, 241, 0],
    v: [0.1, 1.6, 7, 15, 40, 50],
    o: [1, 1, 1, 1, 1, 1],
  },
  "pre_3": {
    r: [167, 61, 92, 0, 249, 80],
    g: [239, 166, 185, 1, 5, 2],
    b: [140, 7, 253, 250, 241, 0],
    v: [0.1, 3, 10, 20, 50, 70],
  },
  "pre_6": {
    r: [167, 61, 92, 0, 249, 80],
    g: [239, 166, 185, 1, 5, 2],
    b: [140, 7, 253, 250, 241, 0],
    v: [0.1, 4, 15, 25, 60, 120],
  },
  "pre_12": {
    r: [167, 61, 92, 0, 249, 80],
    g: [239, 166, 185, 1, 5, 2],
    b: [140, 7, 253, 250, 241, 0],
    v: [0.1, 10, 25, 50, 100, 250],
  },
  "pre_24": {
    r: [167, 61, 92, 0, 249, 80],
    g: [239, 166, 185, 1, 5, 2],
    b: [140, 7, 253, 250, 241, 0],
    v: [0.1, 10, 25, 50, 100, 250],
  },
  "t": {
    r: [21, 51, 82, 0, 0, 0, 0, 0, 60, 125, 156, 206, 151, 132, 76, 3, 19, 138, 199, 236, 255, 255, 255, 255, 187, 115, 74],
    g: [0, 4, 13, 13, 39, 69, 109, 148, 186, 210, 222, 239, 232, 250, 250, 227, 199, 209, 254, 250, 216, 149, 110, 55, 0, 0, 0],
    b: [37, 85, 136, 106, 148, 195, 214, 244, 244, 244, 247, 255, 173, 152, 97, 30, 1, 1, 50, 8, 0, 0, 0, 0, 0, 9, 6],
    v: [263.15, 263.25, 265.15, 267.15, 269.15, 271.15, 273.15, 275.15, 277.15, 279.15, 281.15, 283.15, 285.15, 287.15, 289.15, 291.15, 293.15, 295.15, 297.15, 299.15, 301.15, 303.15, 305.15, 307.15, 309.15, 311.15, 313.15].map(a => IS_INTRANET ? a - 263.15 : a)
  },
  "t_s": {
    r: [21, 51, 82, 0, 0, 0, 0, 0, 60, 125, 156, 206, 151, 132, 76, 3, 19, 138, 199, 236, 255, 255, 255, 255, 187, 115, 74],
    g: [0, 4, 13, 13, 39, 69, 109, 148, 186, 210, 222, 239, 232, 250, 250, 227, 199, 209, 254, 250, 216, 149, 110, 55, 0, 0, 0],
    b: [37, 85, 136, 106, 148, 195, 214, 244, 244, 244, 247, 255, 173, 152, 97, 30, 1, 1, 50, 8, 0, 0, 0, 0, 0, 9, 6],
    v: [263.15, 263.25, 265.15, 267.15, 269.15, 271.15, 273.15, 275.15, 277.15, 279.15, 281.15, 283.15, 285.15, 287.15, 289.15, 291.15, 293.15, 295.15, 297.15, 299.15, 301.15, 303.15, 305.15, 307.15, 309.15, 311.15, 313.15].map(a => IS_INTRANET ? a - 263.15 : a)
  },
  "speed": {
    r: [166, 55, 69, 235, 254, 255, 249, 219],
    g: [255, 251, 234, 249, 216, 162, 108, 38],
    b: [255, 215, 0, 0, 0, 1, 0, 9],
    v: [3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5],
  },
  "rh": {
    r: [245, 245, 246, 247, 248, 249, 206, 134, 76, 73, 64, 56, 52],
    g: [0, 72, 124, 154, 175, 209, 255, 255, 255, 206, 159, 105, 56],
    b: [22, 23, 25, 27, 29, 32, 33, 29, 181, 254, 253, 253, 253],
    v: [0, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 95],
  },
  "speed50": {//
    r:[55,69,235,254,255,249,219,223],
    g:[251,234,249,216,162,108,38,90],
    b:[215,0,0,0,1,0,9,86],
    "v": [35,40,45,50,55,60,65,70]
  },
  "speed400": {//
    r:[55,69,235,254,255,249,219,223],
    g:[251,234,249,216,162,108,38,90],
    b:[215,0,0,0,1,0,9,86],
    "v": [18,21,24,27,30,33,36,39]
  },
  "speed650": {//
    r:[55,69,235,254,255,249,219,223],
    g:[251,234,249,216,162,108,38,90],
    b:[215,0,0,0,1,0,9,86],
    "v": [18,21,24,27,30,33,36,39]
  },
  "speed900": {//
    r:[55,69,235,254,255,249,219,223],
    g:[251,234,249,216,162,108,38,90],
    b:[215,0,0,0,1,0,9,86],
    "v": [6,9,12,15,18,21,24,27]
  },
  "speed975": {//
    r:[55,69,235,254,255,249,219,223],
    g:[251,234,249,216,162,108,38,90],
    b:[215,0,0,0,1,0,9,86],
    "v": [3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5]
  },
  "t50": {//27ge  +70
    r:[51,82,0,0,0,0,0,60,125,156,206,151,133,76,3,19,138,199,236,255,255,255,255,187,115,74],
    g:[4,13,13,39,69,109,148,186,210,222,239,232,250,250,227,199,209,254,250,216,149,110,55,0,0,0],
    b:[85,136,106,148,195,214,244,244,244,247,255,173,153,97,30,1,1,50,8,0,0,0,0,0,9,6],
    "v": [0,0.1,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42 ,44,46,48,50]
  },
  "t400": {//27ge  +70
    r:[51,82,0,0,0,0,0,60,125,156,206,151,133,76,3,19,138,199,236,255,255,255,255,187,115,74],
    g:[4,13,13,39,69,109,148,186,210,222,239,232,250,250,227,199,209,254,250,216,149,110,55,0,0,0],
    b:[85,136,106,148,195,214,244,244,244,247,255,173,153,97,30,1,1,50,8,0,0,0,0,0,9,6],
    "v": [0,20,22,24,26,28,30,32,34,36,38,40,42 ,44,46,48,50 ,52,54,56,58,60,62,64,66,68,70   ]
  },
  "t650": {//27ge  +70
    r:[51,82,0,0,0,0,0,60,125,156,206,151,133,76,3,19,138,199,236,255,255,255,255,187,115,74],
    g:[4,13,13,39,69,109,148,186,210,222,239,232,250,250,227,199,209,254,250,216,149,110,55,0,0,0],
    b:[85,136,106,148,195,214,244,244,244,247,255,173,153,97,30,1,1,50,8,0,0,0,0,0,9,6],
    "v": [0,40,42,44,46,48,50,52,54,56   ,58,60,62,64,66,68,70,72,74,76    ,78,80,82,84,86,88,90    ]
  },
  "t900": {//27ge  +70
    r:[51,82,0,0,0,0,0,60,125,156,206,151,133,76,3,19,138,199,236,255,255,255,255,187,115,74],
    g:[4,13,13,39,69,109,148,186,210,222,239,232,250,250,227,199,209,254,250,216,149,110,55,0,0,0],
    b:[85,136,106,148,195,214,244,244,244,247,255,173,153,97,30,1,1,50,8,0,0,0,0,0,9,6],
    "v": [0,50,52,54,56   ,58,60,62,64,66,68,70,72,74,76    ,78,80,82,84,86,88,90,92,94,96,98,100    ]
  },
  "t975": {//27ge  +70
    r:[51,82,0,0,0,0,0,60,125,156,206,151,133,76,3,19,138,199,236,255,255,255,255,187,115,74],
    g:[4,13,13,39,69,109,148,186,210,222,239,232,250,250,227,199,209,254,250,216,149,110,55,0,0,0],
    b:[85,136,106,148,195,214,244,244,244,247,255,173,153,97,30,1,1,50,8,0,0,0,0,0,9,6],
    "v": [0,60,62,64,66,68,70,72,74,76 ,78,80,82,84,86,88,90,92,94,96,98,100 ,102,104,106,108,110   ]
  },
  "lc": {
    r: [102, 120, 132, 150, 162, 191, 210, 222, 240, 255],
    g: [102, 120, 132, 150, 162, 191, 210, 222, 240, 255],
    b: [102, 120, 132, 150, 162, 191, 210, 222, 240, 255],
    v: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
  },
  "CREF": {
    r: [167, 61, 92, 0, 249, 80],
    g: [239, 166, 185, 1, 5, 2],
    b: [140, 7, 253, 250, 241, 0],
    v: [0, 100, 500, 1000, 3000, 5000],
    o: [1, 1, 1, 1, 1, 1],
  }
}

//关于风速
colors["speed100"] = colors["speed200"] = colors["speed300"] = colors["speed50"]
colors["speed500"] = colors["speed550"] = colors["speed600"] = colors["speed400"]
colors["speed700"] = colors["speed725"] = colors["speed750"]=colors["speed775"]=colors["speed650"]
colors["speed800"] = colors["speed825"] = colors["speed850"]=colors["speed875"]=colors["speed650"]
colors["speed925"] = colors["speed950"] = colors["speed900"]
colors["speed1000"] = colors["speed1025"] = colors["speed975"]
colors["win10_spd"] = colors["speed"]
//关于降水
colors["pre_1h"] = colors["pre_1"]

//关于温度
colors["t100"] = colors["t200"] = colors["t300"] = colors["t50"]
colors["t500"] = colors["t550"] = colors["t600"] = colors["t400"]
colors["t700"] = colors["t725"] = colors["t750"]=colors["t775"]=colors["t650"]
colors["t800"] = colors["t825"] = colors["t850"]=colors["t875"]=colors["t650"]
colors["t925"] = colors["t950"] = colors["t900"]
colors["t1000"] = colors["t1025"] = colors["t975"]
// 关于湿度
colors["soil_moisture"] = colors["rh"]
colors["rh50"] = colors["rh100"] = colors["rh200"] = colors["rh300"] = colors["rh400"] = colors["rh500"] = colors["rh550"] = colors["rh600"] = colors["rh"]
colors["rh650"] = colors["rh700"] = colors["rh725"] = colors["rh750"] = colors["rh775"] = colors["rh800"] = colors["rh825"] = colors["rh850"] = colors["rh"]
colors["rh875"] = colors["rh900"] = colors["rh925"] = colors["rh950"] = colors["rh975"] = colors["rh1000"] = colors["rh1025"] = colors["rh"]

colors["lc50"] = colors["lc100"] = colors["lc200"] = colors["lc300"] = colors["lc400"] = colors["lc500"] = colors["lc550"] = colors["lc600"] = colors["lc"]
colors["lc650"] = colors["lc700"] = colors["lc725"] = colors["lc750"] = colors["lc775"] = colors["lc800"] = colors["lc825"] = colors["lc850"] = colors["lc"]
colors["lc875"] = colors["lc900"] = colors["lc925"] = colors["lc950"] = colors["lc975"] = colors["lc1000"] = colors["lc1025"] = colors["lc"]


export default colors