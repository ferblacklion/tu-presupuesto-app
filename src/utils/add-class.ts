/* eslint-disable */

/**
 * Adds CSS classes from a single HTMLElement or a list of HTMLElement.
 *
 * @param elements - single / list of HTMLElement nodes
 * @param className - single / list of comma-separated css classes
 * @param force - deprecated, no more used
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function addClass(elements: any, className: string): void {
  if (!elements || !className) return;
  // COMPOSITE PATTERN:
  // Same behavior no matter if you are dealing with a single or a collection of elements
  const allElements: any = [].concat(
    'length' in elements ? Array.from(elements) : elements
  );
  if (!allElements.length) return;
  const supportClassList = 'classList' in allElements[0];
  const cssClasses: string[] = className.split(' ').filter(noEmpty);
  for (const element of allElements) {
    if (supportClassList) element.classList.add(...cssClasses);
    //else addCssClassToElement(element, cssClasses);
  }
}

// function addCssClassToElement(element: HTMLElement, classToAdd: string[]) {
//   // FIX Internet Explorer className of SVG Elements
//   const isStringClassName = typeof element.className === 'string';
//   const currentClasses = isStringClassName
//     ? element.className
//     : element.getAttribute('class');

//   const newClasses: string = classToAdd
//     .reduce((finalClass, cssClass) => {
//       return finalClass.indexOf(cssClass) < 0
//         ? `${finalClass} ${cssClass}`
//         : finalClass;
//     }, currentClasses)
//     .trim();

//   if (isStringClassName) element.className = newClasses;
//   else element.setAttribute('class', newClasses);
// }

function noEmpty(text: string) {
  return text.trim().length;
}
