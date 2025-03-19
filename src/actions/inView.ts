interface InViewParameters {
  root?: HTMLElement;
  top?: number;
  bottom?: number;
  progress?: boolean;
}

interface InViewActionReturn {
  update: (params: InViewParameters) => void;
  destroy: () => void;
}

interface ProgressEventDetail {
  ratio: number;
}

declare global {
  interface HTMLElementEventMap {
    'enter': CustomEvent<void>;
    'exit': CustomEvent<void>;
    'progress': CustomEvent<ProgressEventDetail>;
  }
}

/**
 * Svelte action，用于监测元素进入/离开视口时触发自定义事件
 * 示例：
 * ```svelte
 * <p
 *   use:inView
 *   on:enter={() => console.log("enter")}
 *   on:exit={() => console.log("exit")}
 * >
 * ```
 * 
 * 可选参数 { root, top, bottom, progress }
 * top 和 bottom 是数字类型
 * use:inView={{ bottom: 100 }} // 距离视口底部 100 像素
 * 
 * progress 是布尔值，用于增量更新
 * use:inView={{ progress: true }}
 * 
 * @param node - DOM 元素
 * @param params - 配置参数
 * @returns action 对象
 */
export default function inView(
  node: HTMLElement,
  params: InViewParameters = {}
): InViewActionReturn {
  let observer: IntersectionObserver;

  const handleIntersect = (entries: IntersectionObserverEntry[]): void => {
    const intersecting = entries[0].isIntersecting;
    const eventName = intersecting ? "enter" : "exit";
    node.dispatchEvent(new CustomEvent(eventName));
    
    if (params.progress && intersecting) {
      const ratio = entries[0].intersectionRatio;
      const detail: ProgressEventDetail = { ratio };
      node.dispatchEvent(new CustomEvent("progress", { detail }));
    }
  };

  const setObserver = ({ root, top, bottom }: InViewParameters): void => {
    const marginTop = top ? top * -1 : 0;
    const marginBottom = bottom ? bottom * -1 : 0;
    const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
    const options: IntersectionObserverInit = { root, rootMargin };
    
    if (observer) {
      observer.disconnect();
    }
    
    observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(node);
  };

  setObserver(params);

  return {
    update(params: InViewParameters): void {
      setObserver(params);
    },

    destroy(): void {
      if (observer) {
        observer.disconnect();
      }
    }
  };
} 