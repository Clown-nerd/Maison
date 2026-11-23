-- ============================================================================
-- Maison Living — Milestone 2: Demonstration Catalogue Seed Data
-- ============================================================================
-- IMPORTANT:
--   All records inserted by this script are DEMONSTRATION CONTENT
--   (`is_demo_content = true`) migrated from the Milestone 1 sample catalogue.
--   Prices are numeric KES values. Replace or archive these rows before
--   publishing live showroom inventory.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Categories (7 Furniture Categories)
-- ----------------------------------------------------------------------------
INSERT INTO public.categories (
  id,
  name,
  slug,
  subtitle,
  description,
  image_url,
  display_order
)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Sofas',
    'sofas',
    'Architectural Lounge Seating',
    'Deep-seated three-seaters, modular sectionals, and timber-framed daybeds upholstered in Belgian linen and bouclé.',
    '/src/assets/images/cat_sofa_boucle_1795353587199.jpg',
    1
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Beds',
    'beds',
    'Restful Timber Platforms',
    'Low-profile solid hardwood beds featuring woven natural cane, upholstered headboards, and concealed joinery.',
    '/src/assets/images/cat_bed_walnut_1795353586830.jpg',
    2
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Dining furniture',
    'dining-furniture',
    'Gathering Tables & Seating',
    'Generously proportioned East African walnut and mvule dining tables paired with sculpted leather chairs.',
    '/src/assets/images/cat_dining_table_1795353587556.jpg',
    3
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Office furniture',
    'office-furniture',
    'Study Desks & Library Shelving',
    'Refined writing desks and ergonomic studio seating crafted for quiet focus in residential studies.',
    '/src/assets/images/cat_office_desk_1795353587573.jpg',
    4
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'Wardrobes',
    'wardrobes',
    'Fluted & Linen Dressing Systems',
    'Freestanding and modular bedroom armoires finished with hand-fluted timber fronts and solid brass pulls.',
    '/src/assets/images/cat_wardrobe_fluted_1795353587072.jpg',
    5
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    'TV stands',
    'tv-stands',
    'Low-Slung Media Credenzas',
    'Slatted timber media consoles engineered for ventilation, acoustic transparency, and concealed cabling.',
    '/src/assets/images/cat_tv_stand_1795353586784.jpg',
    6
  ),
  (
    '10000000-0000-0000-0000-000000000007',
    'Outdoor furniture',
    'outdoor-furniture',
    'Terrace & Veranda Living',
    'Weather-seasoned hardwood teak, woven marine cord, and quick-dry linen cushions tailored for Kenyan verandas.',
    '/src/assets/images/cat_outdoor_lounge_1795353587919.jpg',
    7
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order;

-- ----------------------------------------------------------------------------
-- 2. Demonstration Products (14 Pieces across all 7 categories)
-- ----------------------------------------------------------------------------
INSERT INTO public.products (
  id,
  name,
  slug,
  short_summary,
  description,
  price,
  category_id,
  product_type,
  supports_custom_sizing,
  availability_status,
  availability_detail,
  dimensions,
  materials,
  finishes,
  specifications,
  colors,
  featured,
  published,
  is_demo_content
)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    'Karen Bouclé Three-Seater Sofa',
    'karen-boucle-three-seater-sofa',
    'Exposed solid walnut rail frame with deep Belgian bouclé cushions.',
    'Designed for airy Nairobi living rooms, the Karen Three-Seater balances a crisp architectural walnut plinth against generously proportioned cushions wrapped in heavyweight ivory bouclé. Feather-wrapped high-resilience foam cores offer lasting loft without losing their tailored silhouette.',
    185000,
    '10000000-0000-0000-0000-000000000001',
    'ready_made',
    true,
    'In Stock',
    '2 ready-made pieces available in Warm Ivory at our Karen showroom.',
    '{"widthCm": 228, "depthCm": 96, "heightCm": 78, "seatHeightCm": 43, "notes": "Custom lengths available from 180 cm to 280 cm on request."}'::jsonb,
    'Kiln-dried East African walnut & solid hardwood sub-frame',
    'Heavyweight Belgian bouclé (52,000 Martindale rub count)',
    '{"frameMaterial": "Kiln-dried East African walnut & solid hardwood sub-frame", "upholsteryOrFinish": "Heavyweight Belgian bouclé (52,000 Martindale rub count)", "joinery": "Mortise-and-tenon exposed perimeter rails with corner blocks", "leadTime": "Ready for dispatch in 2–4 days (Custom sizes: 3–4 weeks)", "origin": "Handcrafted in our Karen workshop, Nairobi", "care": "Vacuum gently with soft upholstery brush; removable cushion covers"}'::jsonb,
    '[{"name": "Warm Ivory Bouclé", "hex": "#F3EFE6", "materialNote": "Signature showroom textile"}, {"name": "Oatmeal Linen", "hex": "#D9C8B2", "materialNote": "Breathable Belgian flax"}, {"name": "Charcoal Weave", "hex": "#3A3732", "materialNote": "Stain-resistant performance wool"}]'::jsonb,
    true,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Kileleshwa Modular Linen Sofa',
    'kileleshwa-modular-linen-sofa',
    'Low-slung four-seat architectural sofa built to custom room layouts.',
    'Composed around low-profile proportions and generous lounging depth, the Kileleshwa Modular Sofa adapts seamlessly to open-plan apartments and garden residences. Recessed timber feet create a calm floating profile while concealed steel connectors lock sections effortlessly.',
    265000,
    '10000000-0000-0000-0000-000000000001',
    'custom_made',
    true,
    'Made to Order',
    'Tailored to your exact wall dimensions in 4 weeks.',
    '{"widthCm": 285, "depthCm": 105, "heightCm": 74, "seatHeightCm": 41, "notes": "Configurable as L-shape chaise or straight four-seater."}'::jsonb,
    'Kiln-dried Kenyan cypress & walnut plinth base',
    'Stonewashed flax linen blend with down-feather topper',
    '{"frameMaterial": "Kiln-dried Kenyan cypress & walnut plinth base", "upholsteryOrFinish": "Stonewashed flax linen blend with down-feather topper", "joinery": "Doweled structural corners with concealed steel brackets", "leadTime": "Made to order in 4 weeks", "origin": "Handcrafted in Nairobi, Kenya", "care": "Professional dry clean recommended; rotate cushions monthly"}'::jsonb,
    '[{"name": "Chalk Linen", "hex": "#F5F1E9"}, {"name": "Warm Sand", "hex": "#D9C8B2"}, {"name": "Walnut Umber", "hex": "#8C735B"}]'::jsonb,
    false,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Lamu Cane & Walnut Platform Bed',
    'lamu-cane-walnut-platform-bed',
    'Handwoven rattan cane headboard framed in solid oiled walnut.',
    'Inspired by coastal Kenyan architecture, the Lamu Platform Bed pairs breathable handwoven natural rattan panels with a solid walnut frame. Subtle chamfered rails and whisper-quiet timber slats support memory foam or pocket-spring mattresses without a bulky box spring.',
    158000,
    '10000000-0000-0000-0000-000000000002',
    'ready_made',
    true,
    'In Stock',
    'Ready-made 6×6 ft King frame in showroom stock; custom sizes in 3 weeks.',
    '{"widthCm": 192, "depthCm": 214, "heightCm": 112, "notes": "Standard Kenyan King (6×6 ft). Queen (5×6 ft) and Super King available."}'::jsonb,
    'Solid East African walnut & woven natural rattan cane',
    'Zero-VOC hand-rubbed matte tung oil',
    '{"frameMaterial": "Solid East African walnut & woven natural rattan cane", "upholsteryOrFinish": "Zero-VOC hand-rubbed matte tung oil", "joinery": "Knock-down brass bed bolts with traditional mortise tenons", "leadTime": "In stock (Nairobi dispatch in 3 days)", "origin": "Crafted in Nairobi using coastal weaving guilds", "care": "Dust cane with soft brush; wipe timber with dry microfibre cloth"}'::jsonb,
    '[{"name": "Oiled Walnut", "hex": "#6B513B"}, {"name": "Smoked Oak", "hex": "#9E856B"}, {"name": "Natural Mvule", "hex": "#B48A5A"}]'::jsonb,
    true,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'Naivasha Linen Upholstered Bed',
    'naivasha-linen-upholstered-bed',
    'Softly padded Belgian linen headboard with solid timber base.',
    'Designed for tranquil mornings, the Naivasha Bed surrounds a generous timber platform with deeply cushioned natural linen rails. The tall upholstered headboard invites comfortable reading while maintaining crisp architectural lines.',
    172000,
    '10000000-0000-0000-0000-000000000002',
    'custom_made',
    true,
    'Made to Order',
    'Crafted to your preferred headboard height and mattress size.',
    '{"widthCm": 198, "depthCm": 218, "heightCm": 118, "notes": "Available in Queen (5×6 ft), King (6×6 ft), and Custom Over-King."}'::jsonb,
    'Seasoned mahogany core with walnut recessed feet',
    '100% Belgian oatmeal flax linen',
    '{"frameMaterial": "Seasoned mahogany core with walnut recessed feet", "upholsteryOrFinish": "100% Belgian oatmeal flax linen", "joinery": "Reinforced corner gussets with silent slatted mattress deck", "leadTime": "Made to order in 3–4 weeks", "origin": "Made in Nairobi, Kenya", "care": "Spot clean linen with mild fabric soap; annual wood conditioning"}'::jsonb,
    '[{"name": "Oatmeal Flax", "hex": "#D9C8B2"}, {"name": "Warm Ivory", "hex": "#F5F1E9"}, {"name": "Espresso Linen", "hex": "#4B433B"}]'::jsonb,
    false,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    'Nanyuki Solid Walnut Dining Table',
    'nanyuki-solid-walnut-dining-table',
    'Eight-seater solid timber dining table on sculptural twin pedestals.',
    'Built to anchor family gatherings for generations, the Nanyuki Dining Table is milled from wide, sustainably sourced hardwood planks with softly radiused edges. Twin curved slab pedestals eliminate corner legs so guests sit comfortably around every edge.',
    210000,
    '10000000-0000-0000-0000-000000000003',
    'ready_made',
    true,
    'In Stock',
    'One 240 cm showcase table available for immediate delivery or collection.',
    '{"widthCm": 240, "depthCm": 105, "heightCm": 76, "notes": "Seats 8 comfortably. Custom lengths (180 cm – 320 cm) crafted to order."}'::jsonb,
    '42 mm solid kiln-dried East African walnut planks',
    'Water- and wine-resistant matte hardwax oil',
    '{"frameMaterial": "42 mm solid kiln-dried East African walnut planks", "upholsteryOrFinish": "Water- and wine-resistant matte hardwax oil", "joinery": "Floating dovetail battens & concealed steel reinforcement", "leadTime": "In stock (240 cm) or custom length in 3–4 weeks", "origin": "Nairobi Workshop, Kenya", "care": "Wipe spills promptly; refresh matte oil annually"}'::jsonb,
    '[{"name": "Deep Walnut", "hex": "#634A35"}, {"name": "Warm Mvule", "hex": "#9D754C"}, {"name": "Natural Oak", "hex": "#C7A984"}]'::jsonb,
    true,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    'Ol Pejeta Curved Dining Chair (Pair)',
    'ol-pejeta-leather-dining-chair-set',
    'Steam-bent solid timber backrest with Kenyan saddle leather seat.',
    'Sold as a matched pair, the Ol Pejeta Dining Chair pairs an ergonomic crescent backrest with supple vegetable-tanned leather upholstery. Its generous arm sweep tucks cleanly beneath standard 76 cm dining aprons.',
    76000,
    '10000000-0000-0000-0000-000000000003',
    'ready_made',
    false,
    'Low Stock',
    '6 pairs currently ready in our Karen showroom.',
    '{"widthCm": 56, "depthCm": 53, "heightCm": 77, "seatHeightCm": 46, "notes": "Price shown is per pair of two chairs."}'::jsonb,
    'Solid walnut frame with steam-bent crest rail',
    'Full-grain cognac Kenyan leather over dense foam',
    '{"frameMaterial": "Solid walnut frame with steam-bent crest rail", "upholsteryOrFinish": "Full-grain cognac Kenyan leather over dense foam", "joinery": "Wedged finger-jointed arm rails", "leadTime": "In stock in sets of 2, 6, or 8", "origin": "Crafted in Nairobi, Kenya", "care": "Condition leather twice yearly with neutral balm"}'::jsonb,
    '[{"name": "Cognac Leather / Walnut", "hex": "#8F5733"}, {"name": "Charcoal Leather / Walnut", "hex": "#292723"}, {"name": "Oat Linen / Mvule", "hex": "#D9C8B2"}]'::jsonb,
    false,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    'Kilimani Architectural Writing Desk',
    'kilimani-architectural-writing-desk',
    'Three-drawer solid walnut desk with turned brass cable grommet.',
    'Created for executive studies and architectural studios, the Kilimani Desk conceals three soft-close drawers seamlessly into its slender front apron. A solid brushed-brass grommet routes laptop and lamp cords discreetly down the rear leg channel.',
    124000,
    '10000000-0000-0000-0000-000000000004',
    'ready_made',
    true,
    'In Stock',
    'Ready for Nairobi delivery within 48 hours.',
    '{"widthCm": 160, "depthCm": 75, "heightCm": 75, "notes": "Knee clearance height 63 cm. Custom widths up to 220 cm available."}'::jsonb,
    'Solid walnut top and tapered legs',
    'Matte satin polyurethane oil & machined brass grommet',
    '{"frameMaterial": "Solid walnut top and tapered legs", "upholsteryOrFinish": "Matte satin polyurethane oil & machined brass grommet", "joinery": "Dovetail drawer boxes on soft-close concealed runners", "leadTime": "In stock (160 cm) or custom in 2–3 weeks", "origin": "Nairobi Workshop, Kenya", "care": "Use felt desk pad for heavy daily writing; dust with dry cloth"}'::jsonb,
    '[{"name": "Walnut / Brushed Brass", "hex": "#7A5E47"}, {"name": "Ebonized Ash / Brass", "hex": "#292723"}]'::jsonb,
    true,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000008',
    'Westlands Bentwood Studio Chair',
    'westlands-bentwood-studio-chair',
    'Moulded walnut shell task chair with full-grain leather cushioning.',
    'Replacing clinical mesh office seating with warm architectural poise, the Westlands Studio Chair wraps a curved walnut timber shell around supportive cognac leather upholstery. Features smooth pneumatic height adjustment and silent hardwood casters.',
    89000,
    '10000000-0000-0000-0000-000000000004',
    'ready_made',
    false,
    'In Stock',
    '4 pieces ready for collection or Nairobi delivery.',
    '{"widthCm": 64, "depthCm": 62, "heightCm": 84, "seatHeightCm": 48, "notes": "Seat height adjusts from 45 cm to 53 cm."}'::jsonb,
    'Moulded walnut shell with powder-coated charcoal base',
    'Cognac aniline leather over sculpted foam',
    '{"frameMaterial": "Moulded walnut shell with powder-coated charcoal base", "upholsteryOrFinish": "Cognac aniline leather over sculpted foam", "joinery": "Precision bentwood lamination with cast aluminum spider base", "leadTime": "In stock at Nairobi showroom", "origin": "Finished & upholstered in Nairobi, Kenya", "care": "Wipe leather gently; oil timber shell lightly once a year"}'::jsonb,
    '[{"name": "Cognac / Walnut", "hex": "#9A5B36"}, {"name": "Charcoal / Walnut", "hex": "#292723"}]'::jsonb,
    false,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000009',
    'Runda Fluted Double Wardrobe',
    'runda-fluted-double-wardrobe',
    'Tall four-door solid timber armoire with fluted fronts and brass pulls.',
    'An architectural focal point for dressing rooms and primary suites, the Runda Wardrobe showcases rhythmically milled vertical walnut fluting and elongated solid brass handles. Inside, adjustable cedar-lined shelving, hanging rails, and velvet-lined drawers organize garments cleanly.',
    245000,
    '10000000-0000-0000-0000-000000000005',
    'custom_made',
    true,
    'Made to Order',
    'Built to your ceiling height and interior hanging layout.',
    '{"widthCm": 180, "depthCm": 62, "heightCm": 225, "notes": "Modular knockdown construction allows easy stair & lift access. Custom internal layouts available."}'::jsonb,
    'Solid walnut fluted doors & hardwood ply carcass',
    'Natural matte lacquer with brushed solid brass pulls',
    '{"frameMaterial": "Solid walnut fluted doors & hardwood ply carcass", "upholsteryOrFinish": "Natural matte lacquer with brushed solid brass pulls", "joinery": "Concealed European soft-close hinges & cam-lock assembly", "leadTime": "Made to order in 4–5 weeks", "origin": "Bespoke cabinetry built in Nairobi, Kenya", "care": "Dust fluted grooves with soft brush attachment"}'::jsonb,
    '[{"name": "Warm Walnut / Brass", "hex": "#6E5239"}, {"name": "Natural Oak / Brass", "hex": "#C6A982"}]'::jsonb,
    true,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000010',
    'Lavington Timber & Brass Armoire',
    'lavington-cane-inset-armoire',
    'Two-door compact wardrobe ideal for guest suites and apartments.',
    'Proportioned for urban Nairobi residences, the Lavington Armoire delivers full-height hanging storage and two deep lower linen drawers within a slender 110 cm footprint. Hand-turned brass knobs and subtle plinth detailing keep the profile light.',
    195000,
    '10000000-0000-0000-0000-000000000005',
    'ready_made',
    true,
    'Low Stock',
    '1 showroom display unit available; bespoke builds in 3 weeks.',
    '{"widthCm": 110, "depthCm": 58, "heightCm": 210, "notes": "Includes double hanging rail + 2 lower drawers."}'::jsonb,
    'Mvule hardwood & walnut veneer cabinetry',
    'Satin beeswax oil finish',
    '{"frameMaterial": "Mvule hardwood & walnut veneer cabinetry", "upholsteryOrFinish": "Satin beeswax oil finish", "joinery": "Mortise framed doors with soft-close hinges", "leadTime": "Ready-made (1 piece in stock) or custom in 3 weeks", "origin": "Nairobi, Kenya", "care": "Keep out of direct harsh sun; wipe with dry cotton cloth"}'::jsonb,
    '[{"name": "Oiled Walnut", "hex": "#755941"}, {"name": "Sandstone Oak", "hex": "#CBB190"}]'::jsonb,
    false,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000011',
    'Muthaiga Slatted Walnut TV Console',
    'muthaiga-slatted-walnut-tv-stand',
    'Acoustic slatted sliding-door media stand on charcoal steel legs.',
    'Engineered for effortless home cinema living, the Muthaiga Media Console conceals amplifiers, routers, and streaming boxes behind breathable horizontal walnut slats. Remote signals pass straight through the slatted doors while rear cut-outs keep cables completely hidden.',
    112000,
    '10000000-0000-0000-0000-000000000006',
    'ready_made',
    true,
    'In Stock',
    'Ready for same-week Nairobi delivery or showroom collection.',
    '{"widthCm": 200, "depthCm": 45, "heightCm": 56, "notes": "Supports screens up to 85 inches. Available in 160 cm and 240 cm widths."}'::jsonb,
    'Solid walnut slatted sliding doors & matte steel base',
    'Natural matte oil with powder-coated charcoal steel',
    '{"frameMaterial": "Solid walnut slatted sliding doors & matte steel base", "upholsteryOrFinish": "Natural matte oil with powder-coated charcoal steel", "joinery": "Precision milled sliding tracks & ventilated back panels", "leadTime": "In stock (200 cm)", "origin": "Handcrafted in Nairobi, Kenya", "care": "Wipe with dry microfibre cloth; avoid abrasive cleaners"}'::jsonb,
    '[{"name": "Walnut / Charcoal Base", "hex": "#6D513A"}, {"name": "Natural Mvule / Charcoal", "hex": "#A57E56"}]'::jsonb,
    true,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000012',
    'Gigiri Low-Profile Media Credenza',
    'gigiri-low-profile-media-credenza',
    'Minimalist floating-style media bench with adjustable interior shelves.',
    'With an understated 48 cm height designed for expansive windows and low sofas, the Gigiri Credenza keeps sightlines open while offering generous concealed storage for vinyl collections, soundbars, and living room essentials.',
    98000,
    '10000000-0000-0000-0000-000000000006',
    'custom_made',
    true,
    'Made to Order',
    'Crafted to your exact AV equipment depth in 2–3 weeks.',
    '{"widthCm": 180, "depthCm": 42, "heightCm": 48, "notes": "Custom cable routing and wall-mount option available on request."}'::jsonb,
    'Solid walnut cabinet with recessed timber plinth',
    'Matte tung oil finish',
    '{"frameMaterial": "Solid walnut cabinet with recessed timber plinth", "upholsteryOrFinish": "Matte tung oil finish", "joinery": "Mitred waterfall outer carcass with adjustable shelf pins", "leadTime": "Made to order in 2–3 weeks", "origin": "Nairobi, Kenya", "care": "Dust weekly; re-oil lightly every 18 months"}'::jsonb,
    '[{"name": "Deep Walnut", "hex": "#634A35"}, {"name": "Warm Oak", "hex": "#C6A982"}]'::jsonb,
    false,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000013',
    'Diani Teak & Cord Terrace Sofa',
    'diani-teak-cord-outdoor-sofa',
    'Weather-treated hardwood teak lounge sofa with woven cord arms.',
    'Engineered for Kenya’s highland sun and coastal breeze alike, the Diani Terrace Sofa combines kiln-dried tropical teak with UV-stabilized marine cord weaving. Quick-dry reticulated foam cushions wrapped in solution-dyed acrylic canvas shrug off sudden afternoon showers.',
    168000,
    '10000000-0000-0000-0000-000000000007',
    'ready_made',
    true,
    'In Stock',
    '2 three-seater terrace sofas ready for dispatch.',
    '{"widthCm": 215, "depthCm": 88, "heightCm": 76, "seatHeightCm": 42, "notes": "Matching slatted teak coffee table and corner configurations available."}'::jsonb,
    'Grade-A oiled tropical teak & UV-stabilized polypropylene cord',
    'Water-repellent Sunbrella-grade canvas over quick-dry foam',
    '{"frameMaterial": "Grade-A oiled tropical teak & UV-stabilized polypropylene cord", "upholsteryOrFinish": "Water-repellent Sunbrella-grade canvas over quick-dry foam", "joinery": "Marine-grade stainless steel fasteners & pegged mortises", "leadTime": "In stock for immediate veranda setup", "origin": "Built in Kenya for indoor-outdoor living", "care": "Hose off dust periodically; oil teak once yearly to preserve golden tone"}'::jsonb,
    '[{"name": "Ivory Canvas / Natural Cord", "hex": "#F3EFE6"}, {"name": "Sandstone / Espresso Cord", "hex": "#D9C8B2"}]'::jsonb,
    true,
    true,
    true
  ),
  (
    '20000000-0000-0000-0000-000000000014',
    'Watamu Slatted Teak Terrace Table',
    'watamu-slatted-teak-terrace-table',
    'Low slatted hardwood garden coffee table with drainage spacing.',
    'Designed as the natural companion to our Diani terrace seating, the Watamu Table features precision-spaced teak slats that shed rainwater cleanly and resist warping through wet and dry seasons.',
    68000,
    '10000000-0000-0000-0000-000000000007',
    'ready_made',
    false,
    'In Stock',
    'Ready for Nairobi delivery or Karen collection.',
    '{"widthCm": 105, "depthCm": 105, "heightCm": 36, "notes": "Custom rectangular veranda dimensions available."}'::jsonb,
    'Solid oiled tropical teak',
    'Penetrating marine-grade timber oil',
    '{"frameMaterial": "Solid oiled tropical teak", "upholsteryOrFinish": "Penetrating marine-grade timber oil", "joinery": "Pinned tenon joints with expansion allowance", "leadTime": "In stock (2–4 day Nairobi delivery)", "origin": "Crafted in Nairobi, Kenya", "care": "Leave natural to weather silver-grey or apply teak oil annually"}'::jsonb,
    '[{"name": "Oiled Golden Teak", "hex": "#A87D4F"}]'::jsonb,
    false,
    true,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_summary = EXCLUDED.short_summary,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  product_type = EXCLUDED.product_type,
  supports_custom_sizing = EXCLUDED.supports_custom_sizing,
  availability_status = EXCLUDED.availability_status,
  availability_detail = EXCLUDED.availability_detail,
  dimensions = EXCLUDED.dimensions,
  materials = EXCLUDED.materials,
  finishes = EXCLUDED.finishes,
  specifications = EXCLUDED.specifications,
  colors = EXCLUDED.colors,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  is_demo_content = EXCLUDED.is_demo_content;

-- ----------------------------------------------------------------------------
-- 3. Product Images (Ordered Gallery Records for All 14 Products)
-- ----------------------------------------------------------------------------
-- Note: Local preview paths match bundled Vite assets; replace with Supabase
-- Storage public URLs under `product-images/products/<slug>/...` as assets
-- are uploaded via the future owner dashboard.
DELETE FROM public.product_images
WHERE product_id IN (
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008',
  '20000000-0000-0000-0000-000000000009',
  '20000000-0000-0000-0000-000000000010',
  '20000000-0000-0000-0000-000000000011',
  '20000000-0000-0000-0000-000000000012',
  '20000000-0000-0000-0000-000000000013',
  '20000000-0000-0000-0000-000000000014'
);

INSERT INTO public.product_images (
  product_id,
  image_url,
  alt_text,
  caption,
  display_order
)
VALUES
  -- 1. Karen Bouclé Three-Seater Sofa
  ('20000000-0000-0000-0000-000000000001', '/src/assets/images/cat_sofa_boucle_1795353587199.jpg', 'Karen Bouclé Three-Seater Sofa in sunlit ivory plaster living room', 'Front showroom elevation in Warm Ivory Bouclé and Oiled Walnut', 0),
  ('20000000-0000-0000-0000-000000000001', '/src/assets/images/hero_living_room_1795353586557.jpg', 'Karen sofa styled in a full Nairobi living space with travertine plinth table', 'In-situ living room pairing with travertine and sisal textures', 1),
  ('20000000-0000-0000-0000-000000000001', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Material palette showing walnut timber, bouclé weave, and brass accents', 'Curated upholstery weave and seasoned timber finish options', 2),

  -- 2. Kileleshwa Modular Linen Sofa
  ('20000000-0000-0000-0000-000000000002', '/src/assets/images/hero_living_room_1795353586557.jpg', 'Kileleshwa Modular Linen Sofa in sunlit open living room', 'Three-quarter architectural view in natural afternoon light', 0),
  ('20000000-0000-0000-0000-000000000002', '/src/assets/images/cat_sofa_boucle_1795353587199.jpg', 'Detail of tailored cushion seams and timber plinth', 'Tailored French-seam cushion geometry', 1),
  ('20000000-0000-0000-0000-000000000002', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Upholstery and timber finish swatches', 'Available Belgian linen and solid hardwood finishes', 2),

  -- 3. Lamu Cane & Walnut Platform Bed
  ('20000000-0000-0000-0000-000000000003', '/src/assets/images/cat_bed_walnut_1795353586830.jpg', 'Lamu Cane and Walnut Platform Bed in calm ivory bedroom', 'King size frame in Oiled Walnut and Natural Rattan Cane', 0),
  ('20000000-0000-0000-0000-000000000003', '/src/assets/images/craft_workshop_detail_1795353587781.jpg', 'Artisan hand-planing walnut joinery for bed frames', 'Hand-fitted mortise-and-tenon corner joinery in our studio', 1),
  ('20000000-0000-0000-0000-000000000003', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Timber and natural linen material pairings', 'Oiled walnut grain paired with natural woven textiles', 2),

  -- 4. Naivasha Linen Upholstered Bed
  ('20000000-0000-0000-0000-000000000004', '/src/assets/images/cat_bed_walnut_1795353586830.jpg', 'Naivasha Linen Bed styled with oatmeal bedding in sunlit room', 'Full bedroom composition with oatmeal linen textiles', 0),
  ('20000000-0000-0000-0000-000000000004', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Linen fabric and timber base sample board', 'Belgian flax upholstery and walnut plinth swatches', 1),

  -- 5. Nanyuki Solid Walnut Dining Table
  ('20000000-0000-0000-0000-000000000005', '/src/assets/images/cat_dining_table_1795353587556.jpg', 'Nanyuki Solid Walnut Dining Table set for eight in a bright dining room', '240 cm eight-seater edition in matte oiled walnut', 0),
  ('20000000-0000-0000-0000-000000000005', '/src/assets/images/craft_workshop_detail_1795353587781.jpg', 'Timber joinery hand-finishing on a dining slab', 'Hand-planed surface finishing for satin tactility', 1),
  ('20000000-0000-0000-0000-000000000005', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Wood species and oil samples', 'East African walnut and white oak finish options', 2),

  -- 6. Ol Pejeta Curved Dining Chair (Pair)
  ('20000000-0000-0000-0000-000000000006', '/src/assets/images/cat_dining_table_1795353587556.jpg', 'Pair of curved walnut and cognac leather dining chairs around dining table', 'Curved walnut frame with cognac saddle leather seat', 0),
  ('20000000-0000-0000-0000-000000000006', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Cognac leather and walnut grain samples', 'Full-grain Kenyan leather and hardwood finish pairing', 1),

  -- 7. Kilimani Architectural Writing Desk
  ('20000000-0000-0000-0000-000000000007', '/src/assets/images/cat_office_desk_1795353587573.jpg', 'Kilimani Architectural Writing Desk with brass lamp and leather chair', '160 cm study desk with brushed brass cable pass-through', 0),
  ('20000000-0000-0000-0000-000000000007', '/src/assets/images/craft_workshop_detail_1795353587781.jpg', 'Precision joinery and drawer fitting in workshop', 'Hand-fitted dovetail drawers in our Nairobi joinery', 1),
  ('20000000-0000-0000-0000-000000000007', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Walnut timber and brushed brass hardware details', 'Solid brass hardware and matte oil timber finishes', 2),

  -- 8. Westlands Bentwood Studio Chair
  ('20000000-0000-0000-0000-000000000008', '/src/assets/images/cat_office_desk_1795353587573.jpg', 'Westlands Bentwood Studio Chair beside walnut writing desk', 'Curved walnut back and cognac leather upholstery', 0),
  ('20000000-0000-0000-0000-000000000008', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Leather and timber finish swatches', 'Full-grain leather and hardwood veneer options', 1),

  -- 9. Runda Fluted Double Wardrobe
  ('20000000-0000-0000-0000-000000000009', '/src/assets/images/cat_wardrobe_fluted_1795353587072.jpg', 'Runda Fluted Double Wardrobe with tall brass handles on limestone floor', 'Full elevation with vertical fluted timber doors', 0),
  ('20000000-0000-0000-0000-000000000009', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Brushed brass pulls and oiled walnut timber details', 'Solid brushed brass hardware and walnut grain samples', 1),
  ('20000000-0000-0000-0000-000000000009', '/src/assets/images/craft_workshop_detail_1795353587781.jpg', 'Cabinetry craftsmanship in our Nairobi studio', 'Precision milling and hand-finishing in our joinery', 2),

  -- 10. Lavington Timber & Brass Armoire
  ('20000000-0000-0000-0000-000000000010', '/src/assets/images/cat_wardrobe_fluted_1795353587072.jpg', 'Lavington Timber Armoire standing in an ivory plaster bedroom', 'Compact architectural armoire silhouette', 0),
  ('20000000-0000-0000-0000-000000000010', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Brass knob and hardwood finish swatches', 'Solid brass pull hardware and wood oil finishes', 1),

  -- 11. Muthaiga Slatted Walnut TV Console
  ('20000000-0000-0000-0000-000000000011', '/src/assets/images/cat_tv_stand_1795353586784.jpg', 'Muthaiga Slatted Walnut TV Console beneath framed television', '200 cm slatted walnut console on matte charcoal legs', 0),
  ('20000000-0000-0000-0000-000000000011', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Walnut timber grain and matte hardware details', 'Hand-oiled East African walnut slats', 1),

  -- 12. Gigiri Low-Profile Media Credenza
  ('20000000-0000-0000-0000-000000000012', '/src/assets/images/cat_tv_stand_1795353586784.jpg', 'Gigiri Low-Profile Media Credenza in warm beige room', 'Low-slung silhouette suited to large-format living rooms', 0),
  ('20000000-0000-0000-0000-000000000012', '/src/assets/images/craft_workshop_detail_1795353587781.jpg', 'Joinery assembly of timber credenza', 'Precision timber joinery in our Nairobi studio', 1),

  -- 13. Diani Teak & Cord Terrace Sofa
  ('20000000-0000-0000-0000-000000000013', '/src/assets/images/cat_outdoor_lounge_1795353587919.jpg', 'Diani Teak and Cord Terrace Sofa on stone patio surrounded by greenery', 'Terrace lounge configuration in Oiled Teak & Warm Ivory', 0),
  ('20000000-0000-0000-0000-000000000013', '/src/assets/images/bespoke_material_swatches_1795353587465.jpg', 'Outdoor textile and timber finish palette', 'UV-resistant outdoor canvas and oiled hardwood samples', 1),

  -- 14. Watamu Slatted Teak Terrace Table
  ('20000000-0000-0000-0000-000000000014', '/src/assets/images/cat_outdoor_lounge_1795353587919.jpg', 'Watamu Slatted Teak Terrace Table in foreground of outdoor patio', 'Square slatted veranda coffee table in oiled teak', 0),
  ('20000000-0000-0000-0000-000000000014', '/src/assets/images/craft_workshop_detail_1795353587781.jpg', 'Hardwood joinery detail', 'Hand-chamfered drainage slats', 1);

-- ----------------------------------------------------------------------------
-- 4. Store Settings (Single Demonstration Showroom Row)
-- ----------------------------------------------------------------------------
INSERT INTO public.store_settings (
  id,
  business_name,
  tagline,
  whatsapp_number,
  phone_number,
  email,
  address,
  delivery_information,
  regional_delivery_information,
  collection_information,
  opening_hours,
  logo_url,
  is_demo_content
)
VALUES (
  '30000000-0000-0000-0000-000000000001',
  'Maison Living',
  'Contemporary Kenyan Furniture & Bespoke Joinery',
  '254700000000',
  '+254 700 000 000',
  'concierge@maisonliving.co.ke',
  'Hardy Design Courtyard, Ushirika Road, Karen, Nairobi, Kenya',
  'White-glove delivery and in-room placement across Nairobi within 2–4 business days for ready-made pieces.',
  'Scheduled blanket-wrapped freight across Kenya including Mombasa, Nanyuki, Naivasha, Nakuru, Kisumu, and Eldoret.',
  'Complimentary showroom and workshop collection available from our Karen courtyard by prior scheduling.',
  'Monday – Saturday, 9:00 AM – 6:00 PM EAT',
  NULL,
  true
)
ON CONFLICT (id) DO NOTHING;

COMMIT;
