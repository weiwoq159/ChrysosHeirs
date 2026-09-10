import TribiosCover from "@/assets/images/Tribios.webp";
import type { ModuleDefinition } from "@/shared/types/modules";

import { tribiosRouteSegment } from "./constants";

export const Tribios = {
  name: "Tribios",
  title: "提里西庇俄斯",
  purpose: "统筹已收录的工具与功能入口",
  path: `/${tribiosRouteSegment}`,
  description: "「万径之门，雅努斯」",
  cover: TribiosCover,
  descriptionHero:
    "雅努萨波利斯的圣女，缇里西庇俄丝，窃夺「门径」火种的黄金裔，你要为众生奔走，令救世的讯息晓喻大地——找寻那流淌黄金神血的人子，冲破世间至暗，去往星月满天的明日。",
} satisfies ModuleDefinition;
