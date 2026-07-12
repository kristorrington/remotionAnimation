import React from "react";

// Live layout of the animation panel, provided to beat scenes so full-panel
// treatments (receipt bleeds) can counter the zoom/shift and track the seam:
// `panelH` is the panel's CURRENT pixel height (838 split → 1920 full).
export const PanelLayout = React.createContext<{ zoom: number; shift: number; panelH: number }>({ zoom: 1, shift: 48, panelH: 838 });
