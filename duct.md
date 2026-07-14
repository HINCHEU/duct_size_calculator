# Duct Types and Area Calculations

This document describes all the duct types supported by the calculator, their required dimensions, and the mathematical formulas used to calculate their surface areas. In general, dimensions are provided in millimeters (mm) and are converted to meters (m) by dividing by 1000 to compute the surface area in square meters (m²).

---

### Rectangular Straight Duct (`rect_straight`)
- **Description**: A standard straight duct with a rectangular cross-section.
- **Inputs**: Width A, Height B, Length L
- **Area Calculation**: `Perimeter × Length`
  - Formula: `2 × ((A/1000) + (B/1000)) × (L/1000)`

### Round Duct (`round_straight`)
- **Description**: A standard straight duct with a circular cross-section.
- **Inputs**: Diameter Ø, Length L
- **Area Calculation**: `Perimeter × Length`
  - Formula: `π × (D/1000) × (L/1000)`

### Rectangular Elbow 90° (`rect_elbow90`)
- **Description**: A 90-degree bend for a rectangular duct.
- **Inputs**: Width A, Height B, Inner Radius R
- **Area Calculation**: `Perimeter × Arc Length at Centerline`
  - Centerline Radius (`Rc`) = `R + A/2`
  - Arc Length = `(π/2) × (Rc/1000)`
  - Formula: `(2 × (A + B)/1000) × Arc Length`

### Rectangular Elbow 45° (`rect_elbow45`)
- **Description**: A 45-degree bend for a rectangular duct.
- **Inputs**: Width A, Height B, Inner Radius R
- **Area Calculation**: `Perimeter × Arc Length at Centerline`
  - Centerline Radius (`Rc`) = `R + A/2`
  - Arc Length = `(π/4) × (Rc/1000)`
  - Formula: `(2 × (A + B)/1000) × Arc Length`

### Round Elbow 90° (`round_elbow90`)
- **Description**: A 90-degree bend for a circular duct.
- **Inputs**: Diameter Ø, Bend Radius R
- **Area Calculation**: `Perimeter × Arc Length at Centerline`
  - Centerline Radius (`Rc`) = `R + D/2`
  - Formula: `(π × D/1000) × ((π/2) × Rc/1000)`

### Round Elbow 45° (`round_elbow45`)
- **Description**: A 45-degree bend for a circular duct.
- **Inputs**: Diameter Ø, Bend Radius R
- **Area Calculation**: `Perimeter × Arc Length at Centerline`
  - Centerline Radius (`Rc`) = `R + D/2`
  - Formula: `(π × D/1000) × ((π/4) × Rc/1000)`

### Duct Reducer (Rect-Rect) (`duct_reducer`)
- **Description**: A transition duct connecting two rectangular ducts of different sizes.
- **Inputs**: Start Width A, Start Height B, End Width C, End Height D, Length L
- **Area Calculation**: Uses the perimeter of the larger end and an equivalent length factor of 1.2.
  - Formula: `(2 × (A + B)/1000) × (L/1000 × 1.2)`

### Duct Reducer (Rect-Round) (`rect_to_round`)
- **Description**: A transition duct from a rectangular cross-section to a circular one.
- **Inputs**: Width A, Height B, Diameter Ø, Length L
- **Area Calculation**: Averages a straight rectangular section and a transition section.
  - Rectangular Perimeter (`pRect`) = `2 × (A + B)`
  - Round Perimeter (`pRound`) = `π × D`
  - Formula: `(pRect × L/2 + ((pRect + pRound)/2) × L/2) / 1,000,000`

### Butterfly Duct (One Side Round) (`butterfly_round`)
- **Description**: A Y-branching duct where the main neck is rectangular, one branch is round, and the other is rectangular.
- **Area Calculation**: Sum of left round branch, right rectangular branch, and main neck areas.
  - Left Branch: uses effective length `L + R1 × 1.2`
  - Right Branch: uses elbow length `(π/2) × R2`
  - Main Neck: uses average radius `(R1 + R2) / 2`

### Butterfly Duct (Two Side Round) (`butterfly_round_two`)
- **Description**: A Y-branching duct where the main neck is rectangular, and both branches are round.
- **Area Calculation**: Sum of left round branch, right round branch, and main neck areas. Similar effective lengths are applied.

### Butterfly Duct (Rect) (`butterfly_rect`)
- **Description**: A Y-branching duct where all sections are rectangular.
- **Area Calculation**: Sum of left branch, right branch, and main neck areas using elbow lengths (`π/2 × R`).

### Collar Duct (`collar_duct`)
- **Description**: A transition fitting or collar.
- **Inputs**: Start Width A, Start Height B, End Width C, End Height D, Length L
- **Area Calculation**: Approximated area using Widths A and C.
  - Formula: `2 × (A + C)/1000 × (L/1000 × 1.2)`

### Offset Duct (`offset_duct`)
- **Description**: A duct that shifts its centerline while maintaining or changing size.
- **Inputs**: Start W/H, End W/H, Offset Drop R, Total Length L
- **Area Calculation**: Average perimeter multiplied by effective hypotenuse length.
  - Avg Perimeter (`avgP`) = `(2×(A+B) + 2×(C+D2)) / 2`
  - Effective Length = `√(L² + R²)`

### Offset Duct (With Straight Ends) (`offset_duct_straight`)
- **Description**: An offset duct including straight sections at the inlet and outlet.
- **Area Calculation**: Perimeter × Straight Lengths + Middle section considering the hypotenuse for the width change and straight length for the height.

### Offset Duct (With Angular Ends) (`offset_duct_angular`)
- **Description**: An offset duct defined by curve radii and angles.
- **Area Calculation**: Computes the true centerline curve length trigonometrically and multiplies it by the rectangular perimeter.

### Y-Ducting (Branch Takeoff) (`y_duct`)
- **Description**: A main straight trunk with a branching takeoff.
- **Area Calculation**: Area of main trunk (`Perimeter × Length`) plus the area of the branch and side sections (calculated as 90° elbows using `π/2 × R`).

### R-Type Duct (`r_type`)
- **Description**: A branching duct with a main inlet, an elbow branch, and a straight continuation outlet.
- **Area Calculation**: Inlet Area (half length) + Outlet Area (half length) + Branch Elbow Area.

### R-Type Duct (Round Two Side) (`r_type_round_two`)
- **Description**: A variation of the R-Type duct with round branches.
- **Area Calculation**: Sum of the top round branch, side round branch, and the rectangular neck.

### Plenum Boxes (`plenum_box`, `plenum_top`, `plenum_tapered`)
- **Description**: Air distribution boxes with various inlet configurations (side, top, oval).
- **Area Calculation**: Geometric sum of all external faces (width × height + depth × height etc.), subtracting any holes for necks/connectors, and adding the areas of those necks, connectors, and flanges.

### Canvas Connections (`canvas_round`, `canvas_rect`)
- **Description**: Flexible canvas joints for vibration isolation.
- **Area Calculation**: Perimeter × Length.

### Fan Connection (`fan_conn`)
- **Description**: Transition piece connecting a duct to a fan unit.
- **Area Calculation**: Sum of slanted top/bottom panels, slanted side panels, straight inlet section, outlet flange, and strip gap.

### Wire Mesh (`wire_mesh`)
- **Description**: Wire mesh covering.
- **Area Calculation**: Total sheet area `A × B / 1,000,000`.

### Transfer Air Duct (`transfer_air`)
- **Description**: A Z-shaped duct allowing air transfer through an obstruction, often with two legs and a middle connector.
- **Area Calculation**: Sum of right leg/collar/flange + left leg/collar/flange + middle connector area, subtracting the open hole inlets/outlets.

### 4-Ways Duct (`4ways`)
- **Description**: A central junction duct branching out in four directions.
- **Area Calculation**: Sum of the four individual branching sides (calculated using average bend radii) and the central body area.

### Angle Bars (`angle_bar`, `angle_bar_u`)
- **Description**: Supports and brackets (L-shape or U-shape).
- **Area Calculation**: Rather than surface area, these are quantified by their linear length in meters (`L / 1000`).
