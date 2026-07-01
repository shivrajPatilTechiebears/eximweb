import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Image01Icon,
  Invoice01Icon,
  ReceiptDollarIcon,
  ListViewIcon,
  NoteEditIcon,
  FileText,
  Package01Icon,
  ShippingTruck01Icon,
  TaskDone01Icon,
  BoatIcon,
  BookBookmark01Icon,
  Calendar01Icon,
  Airplane01Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  Search01Icon,
  Settings01Icon,
  Notification01Icon,
  ArrowLeft01Icon,
  BarChartIcon,
  Edit01Icon,
  Delete01Icon,
  MoreVerticalIcon,
  Shield01Icon,
  Add01Icon,
  AddCircleIcon,
  ShoppingCart01Icon,
  Clock01Icon,
  EyeIcon,
  InformationCircleIcon,
  Cancel01Icon,
  Tag01Icon,
  User02Icon,
  Pdf01Icon,
  Attachment01Icon,
  ListFilter,
  ImageAdd01Icon,
  Download01Icon,
  PrinterIcon,
  SentIcon,
  CheckIcon,
  SaveIcon,
} from "@hugeicons/core-free-icons";

// ── Icon name → HugeIcons data map ────────────────────────────────────────────

const ICON_MAP: Record<string, IconSvgElement> = {
  // Navigation — top-level
  photo_library:   Image01Icon,
  request_quote:   Invoice01Icon,
  inventory_2:     Package01Icon,
  local_shipping:  ShippingTruck01Icon,
  book_online:     BookBookmark01Icon,

  // Navigation — sub-items
  format_list_bulleted: ListViewIcon,
  pending_actions:      NoteEditIcon,
  description:          FileText,
  receipt_long:         ReceiptDollarIcon,
  task_alt:             TaskDone01Icon,
  directions_boat:      BoatIcon,
  event_available:      Calendar01Icon,
  flight_takeoff:       Airplane01Icon,

  // UI controls
  expand_less:    ChevronUpIcon,
  expand_more:    ChevronDownIcon,
  search:         Search01Icon,
  settings:       Settings01Icon,
  notifications:  Notification01Icon,
  arrow_back:     ArrowLeft01Icon,
  close:          Cancel01Icon,

  // Actions
  add:        Add01Icon,
  add_circle: AddCircleIcon,
  edit:       Edit01Icon,
  delete:     Delete01Icon,
  more_vert:  MoreVerticalIcon,
  visibility: EyeIcon,

  // Info / data
  shopping_cart:  ShoppingCart01Icon,
  schedule:       Clock01Icon,
  info:           InformationCircleIcon,
  calendar_today: Calendar01Icon,
  sell:           Tag01Icon,
  person:         User02Icon,
  bar_chart:      BarChartIcon,

  // Files
  picture_as_pdf: Pdf01Icon,
  download:       Download01Icon,

  // Actions
  print: PrinterIcon,
  send:  SentIcon,

  // List / note variants
  list_alt:   ListViewIcon,
  event_note: Calendar01Icon,

  // Misc
  security:             Shield01Icon,
  attachment:           Attachment01Icon,
  filter_list:          ListFilter,
  add_photo_alternate:  ImageAdd01Icon,
  check:                CheckIcon,
  save:                 SaveIcon,
};

// ── Component ─────────────────────────────────────────────────────────────────

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function Icon({ name, className, size, strokeWidth = 1.5 }: IconProps) {
  const iconDef = ICON_MAP[name];

  // Extract pixel size from text-[Npx] Tailwind class, fall back to 18
  const match = className?.match(/text-\[(\d+(?:\.\d+)?)(?:px)?\]/);
  const resolvedSize = size ?? (match ? parseFloat(match[1]) : 18);

  // Strip the size class — HugeIcons uses the `size` prop for SVG dimensions
  const svgClass = className?.replace(/text-\[\d+(?:\.\d+)?(?:px)?\]\s?/g, "").trim();

  if (!iconDef) return null;

  return (
    <HugeiconsIcon
      icon={iconDef}
      size={resolvedSize}
      strokeWidth={strokeWidth}
      className={svgClass}
    />
  );
}
