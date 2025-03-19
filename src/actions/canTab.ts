interface CanTabParameters {
  disable?: boolean;
}

interface CanTabActionReturn {
  update: (params: CanTabParameters) => void;
  destroy: () => void;
}

/**
 * Svelte action 用于控制元素的 tab 键导航
 * @param node - DOM 元素
 * @param params - 配置参数
 * @returns action 对象
 */
export default function canTab(
  node: HTMLElement,
  params?: CanTabParameters
): CanTabActionReturn {
  const elements = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "details",
    "[tabindex]:not([tabindex='-1'])"
  ];

  const setup = (p?: CanTabParameters): void => {
    focusableElements.forEach(el => {
      if (p?.disable) {
        el.setAttribute("tabindex", "-1");
      } else {
        el.removeAttribute("tabindex");
      }
    });
  };

  const query = elements.join(", ");
  const focusableElements = [...node.querySelectorAll(query)] as HTMLElement[];

  setup(params);

  return {
    update(params: CanTabParameters): void {
      setup(params);
    },

    destroy(): void {
      focusableElements.forEach(el => el.removeAttribute("tabindex"));
    }
  };
} 