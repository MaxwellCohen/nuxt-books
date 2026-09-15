import { h, type FunctionalComponent } from "vue";
import { cn } from "#shared/utils";

type IconProps = { class?: string };

const Icon: FunctionalComponent<IconProps & { fill?: string }> = (
  props,
  { slots },
) =>
  h(
    "svg",
    {
      "aria-hidden": "true",
      class: props.class ?? "size-4",
      fill: props.fill ?? "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": 2,
      viewBox: "0 0 24 24",
    },
    slots.default?.(),
  );

export const SearchIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("circle", { cx: "11", cy: "11", r: "8" }),
    h("path", { d: "m21 21-4.3-4.3" }),
  ]);

export const XIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("path", { d: "M18 6 6 18" }),
    h("path", { d: "m6 6 12 12" }),
  ]);

export const ChevronLeftIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [h("path", { d: "m15 18-6-6 6-6" })]);

export const ChevronRightIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [h("path", { d: "m9 18 6-6-6-6" })]);

export const ChevronDownIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [h("path", { d: "m6 9 6 6 6-6" })]);

export const SlidersHorizontalIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("path", { d: "M10 5H3" }),
    h("path", { d: "M12 19H3" }),
    h("path", { d: "M14 3v4" }),
    h("path", { d: "M16 17v4" }),
    h("path", { d: "M21 12H3" }),
    h("path", { d: "M21 5h-7" }),
    h("path", { d: "M21 19h-5" }),
    h("path", { d: "M8 10v4" }),
  ]);

export const ArrowLeftIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("path", { d: "m12 19-7-7 7-7" }),
    h("path", { d: "M19 12H5" }),
  ]);

export const AlertTriangleIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("path", {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
    }),
    h("path", { d: "M12 9v4" }),
    h("path", { d: "M12 17h.01" }),
  ]);

export const StarIcon: FunctionalComponent<IconProps> = (props) =>
  h(
    "svg",
    {
      "aria-hidden": "true",
      class: cn("size-4", props.class),
      fill: "currentColor",
      stroke: "none",
      viewBox: "0 0 24 24",
    },
    [
      h("path", {
        d: "M12 2.5 14.9 8.7l6.8.6-5.2 4.6 1.6 6.6L12 17.3 5.9 20.5l1.6-6.6-5.2-4.6 6.8-.6z",
      }),
    ],
  );

export const SunIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("circle", { cx: "12", cy: "12", r: "4" }),
    h("path", { d: "M12 2v2" }),
    h("path", { d: "M12 20v2" }),
    h("path", { d: "m4.93 4.93 1.41 1.41" }),
    h("path", { d: "m17.66 17.66 1.41 1.41" }),
    h("path", { d: "M2 12h2" }),
    h("path", { d: "M20 12h2" }),
    h("path", { d: "m6.34 17.66-1.41 1.41" }),
    h("path", { d: "m19.07 4.93-1.41 1.41" }),
  ]);

export const MoonIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }),
  ]);

export const MonitorIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }),
    h("path", { d: "M8 21h8" }),
    h("path", { d: "M12 17v4" }),
  ]);

export const BookOpenIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("path", { d: "M12 7v14" }),
    h("path", {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
    }),
  ]);

export const GlobeIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("circle", { cx: "12", cy: "12", r: "10" }),
    h("path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }),
    h("path", { d: "M2 12h20" }),
  ]);

export const CalendarDaysIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("path", { d: "M8 2v4" }),
    h("path", { d: "M16 2v4" }),
    h("rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }),
    h("path", { d: "M3 10h18" }),
  ]);

export const Building2Icon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("path", { d: "M10 12h4" }),
    h("path", { d: "M10 8h4" }),
    h("path", { d: "M14 21v-3a2 2 0 0 0-4 0v3" }),
    h("path", {
      d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
    }),
    h("path", { d: "M6 21V5a2 2 0 0 1 2-2h3v7H6Z" }),
  ]);

export const HashIcon: FunctionalComponent<IconProps> = (props) =>
  h(Icon, props, () => [
    h("path", { d: "M4 9h16" }),
    h("path", { d: "M4 15h16" }),
    h("path", { d: "M10 3 8 21" }),
    h("path", { d: "M16 3l-2 18" }),
  ]);

export const SpinnerIcon: FunctionalComponent<IconProps> = (props) =>
  h(
    "svg",
    {
      "aria-hidden": "true",
      class: cn("size-4 animate-spin", props.class),
      fill: "none",
      viewBox: "0 0 24 24",
    },
    [
      h("circle", {
        class: "opacity-25",
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        "stroke-width": "3",
      }),
      h("path", {
        class: "opacity-90",
        d: "M22 12a10 10 0 0 0-10-10",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-width": "3",
      }),
    ],
  );
