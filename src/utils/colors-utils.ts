import { Color, Opacity } from 'enums/Color';
import { ColorPalette } from 'models/ColorPalette';
import { RelevantColors } from 'models/RelevantColors';

namespace ColorsUtils {
  /**
   * Convert a percentage into a green to red color scale
   * @param {number} perc Percentage
   * @return {string} An html color tag
   */
  export function greenToRed(perc: number) {
    let r = 0;
    let g = 0;
    const b = 0;
    if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    } else {
      g = 255;
      r = Math.round(510 - 5.1 * perc);
    }
    const h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  }

  export function applyOpacity(color: Color, opacity: Opacity) {
    const hexOpacity = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');
    return `${color}${hexOpacity}`;
  }

  export function getRelevantColor(
    colors: ColorPalette,
    flags: RelevantColors
  ) {
    return flags.active && colors.active
      ? colors.active
      : flags.focused && colors.focused
      ? colors.focused
      : flags.hovered && colors.hovered
      ? colors.hovered
      : flags.disabled && colors.disabled
      ? colors.disabled
      : colors.default;
  }
}

export default ColorsUtils;
