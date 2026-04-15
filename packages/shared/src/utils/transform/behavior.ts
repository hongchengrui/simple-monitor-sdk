/**
 * 行为数据转换
 */
export function transformDomEvent(event: Event, target: HTMLElement): any {
  return {
    type: 'behavior',
    action: event.type,
    element: {
      tag: target.tagName.toLowerCase(),
      id: target.id,
      className: target.className
    }
  }
}
