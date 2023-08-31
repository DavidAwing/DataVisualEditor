


export function UnitConversion() {
  /**
  * 获取DPI
  * @returns {Array}
  */
  this.conversion_getDPI = function () {
    const arrDPI = [];
    if (window.screen.deviceXDPI) {
      arrDPI[0] = window.screen.deviceXDPI;
      arrDPI[1] = window.screen.deviceYDPI;
    } else {
      const tmpNode = document.createElement("DIV");
      tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
      document.body.appendChild(tmpNode);
      arrDPI[0] = parseInt(tmpNode.offsetWidth);
      arrDPI[1] = parseInt(tmpNode.offsetHeight);
      tmpNode.parentNode.removeChild(tmpNode);
    }
    return arrDPI;
  };
  /**
  * px转换为mm
  * @param value
  * @returns {number}
  */
  this.pxConversionMm = function (value) {
    const inch = value / this.conversion_getDPI()[0];
    const c_value = inch * 25.4;
    // console.log(c_value);
    return c_value;
  };
  /**
  * mm转换为px
  * @param value
  * @returns {number}
  */
  this.mmConversionPx = function (value) {
    const inch = value / 25.4;
    const c_value = inch * this.conversion_getDPI()[0];
    // console.log(c_value);
    return c_value;
  }
}
