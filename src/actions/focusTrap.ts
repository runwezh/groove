interface FocusTrapParameters {
  disable?: boolean;
}

interface FocusTrapActionReturn {
  update: (params: FocusTrapParameters) => void;
  destroy: () => void;
}

/**
 * Svelte action 用于创建焦点陷阱，限制 Tab 键导航在指定元素内
 * @param node - DOM 元素
 * @param params - 配置参数
 * @returns action 对象
 */
export default function focusTrap(
  node: HTMLElement,
  params?: FocusTrapParameters
): FocusTrapActionReturn {
  const elements = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "details",
    "[tabindex]:not([tabindex='-1'])"
  ];
  
  let firstFocusable: HTMLElement | undefined;
  let lastFocusable: HTMLElement | undefined;
  let active = false;

  const moveFocusToTop = (e: KeyboardEvent): void => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      firstFocusable?.focus();
    }
  };

  const moveFocusToBottom = (e: KeyboardEvent): void => {
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      lastFocusable?.focus();
    }
  };

  const add = (): void => {
    if (firstFocusable) {
      firstFocusable.addEventListener("keydown", moveFocusToBottom);
    }
    if (lastFocusable) {
      lastFocusable.addEventListener("keydown", moveFocusToTop);
    }
    active = true;
  };

  const remove = (): void => {
    if (firstFocusable) {
      firstFocusable.removeEventListener("keydown", moveFocusToBottom);
    }
    if (lastFocusable) {
      lastFocusable.removeEventListener("keydown", moveFocusToTop);
    }
    active = false;
  };

  const setup = (p?: FocusTrapParameters): void => {
    if (active && p?.disable) {
      remove();
    } else if ((!active && !p) || (p && !p.disable)) {
      add();
    }
  };

  const query = elements.join(", ");
  const focusableElements = [...node.querySelectorAll(query)] as HTMLElement[];

  firstFocusable = focusableElements.shift();
  lastFocusable = focusableElements.pop();

  setup(params);

  return {
    update(params: FocusTrapParameters): void {
      setup(params);
    },

    destroy(): void {
      remove();
    }
  };
} 