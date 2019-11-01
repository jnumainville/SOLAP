/**
 * Create Styled Layer Description (SLD) XML for a set of polygons with
 * PropertyIsBetween filters and adustable fill/stroke.
 *
 *   let ex1 = new app.cs("THE NAME", "THE TITLE", "PROPERTY NAME", [{title: "class1", lowVal: 0, highVal: 99, fillColor: "#ffff00"}])
 *   let ex2 = new app.cs("THE NAME", "THE TITLE", "PROPERTY NAME", [{title: "class1", lowVal: 0, highVal: 99, fillColor: "#ffff00"}, {title: "class2", lowVal: 100, highVal: 1000, fillColor: "#0000ff"}])
 *
 * @class ClassedPolygonsSld
 */
class ClassedPolygonsSld {
  /**
   *Creates an instance of ClassedPolygonsSld.
   * @param {string} layerName Name of layer to render (e.g. <workspace>:<layer> for GeoServer)
   * @param {string} styleTitle Title for the style
   * @param {string} propertyName Attribute name to use for symbolization
   * @param {Object[]} classRules Rules for each class (name, low/high, fill, stroke)
   * @memberof ClassedPolygonsSld
   */
  constructor(layerName, styleTitle, propertyName, classRules) {
    this._layerName = layerName;
    this._styleTitle = styleTitle;
    this._propName = propertyName;
    this._sldEnd =
      "</FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>";
    this._classes = classRules;
    this._polygonStyle = {
      fillColor: "#00ff00",
      strokeColor: "#000000",
      strokeWidth: 0.5
    };
  }

  /**
   * Set layer name
   *
   * @memberof ClassedPolygonsSld
   */
  set layerName(name) {
    this._layerName = name;
  }

  /**
   * Set title
   *
   * @memberof ClassedPolygonsSld
   */
  set styleTitle(title) {
    this._style = title;
  }

  /**
   * Set class rules
   *
   * @memberof ClassedPolygonsSld
   */
  set classRules(rules) {
    this._classes = rules;
  }

  /**
   * Get SLD XML
   *
   * @readonly
   * @memberof ClassedPolygonsSld
   */
  get sld() {
    let result = this._makeSldFront();
    for (let i = 0; i < this._classes.length; i++) {
      result += this._makeRule(this._propName, this._classes[i]);
    }

    result += this._sldEnd;
    return result;
  }

  /**
   * Get XML for a PropertyIsBetweenFilter
   *
   * @param {string} propName PropertyName to use for symbolization
   * @param {number} lowVal Low end of class
   * @param {number} highVal High end of class
   * @returns XML for a an ogc:Filter element
   * @memberof ClassedPolygonsSld
   */
  _makeFilter(propName, lowVal, highVal) {
    return `<ogc:Filter>
              <ogc:PropertyIsBetween>
                <ogc:PropertyName>${propName}</ogc:PropertyName>
                <ogc:LowerBoundary>
                  <Literal>${lowVal}</Literal>
                </ogc:LowerBoundary>
                <ogc:UpperBoundary>
                  <Literal>${highVal}</Literal>
                </ogc:UpperBoundary>
              </ogc:PropertyIsBetween>
            </ogc:Filter>`;
  }

  /**
   * Make a PolygonSymbolizer with fill color, stroke color, and stroke width
   *
   * @param {Object} styleOpts
   * @returns XML for a PolygonSymbolizer element
   * @memberof ClassedPolygonsSld
   */
  _makePolygonSymbolizer(styleOpts) {
    const opts = Object.assign({}, this._polygonStyle, styleOpts);

    return `<PolygonSymbolizer>
              <Fill>
                <CssParameter name="fill">${opts.fillColor}</CssParameter>
              </Fill>
              <Stroke>
                <CssParameter name="stroke">${opts.strokeColor}</CssParameter>
                <CssParameter name="stroke-width">${opts.strokeWidth}</CssParameter>
              </Stroke>
            </PolygonSymbolizer>`;
  }

  /**
   * Make an SLD rule
   *
   * @param {Object} rule class rule
   * @param {string} rule.title title for the class
   * @param {number} rule.lowVal low end
   * @param {number} rule.highVal high end
   * @param {string} rule.fillColor polygon fill color, hex with leading #
   * @param {string} rule.strokeColor stroke color, hex with leading #
   * @param {number} rule.strokeWidth stroke width
   * @returns string XML for a Rule, including ogc:Filter and PolygonSymbolizer
   * @memberof ClassedPolygonsSld
   */
  _makeRule(propName, rule) {
    let style = {};
    if ("fillColor" in rule) {
      style.fillColor = rule.fillColor;
    }
    if ("strokeColor" in rule) {
      style.strokeColor = rule.strokeColor;
    }
    if ("strokeWidth" in rule) {
      style.strokeWidth = rule.strokeWidth;
    }

    return (
      `<Rule><Title>${rule.title}</Title>` +
      this._makeFilter(propName, rule.lowVal, rule.highVal) +
      this._makePolygonSymbolizer(style) +
      "</Rule>"
    );
  }

  /**
   * Get the start of the SLD XML
   *
   * @returns SLD front matter, name, and title
   * @memberof ClassedPolygonsSld
   */
  _makeSldFront() {
    return `<?xml version="1.0" encoding="ISO-8859-1" ?>
              <StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <NamedLayer>
                  <Name>${this._layerName}</Name>
                  <UserStyle>
                    <Title>${this._styleTitle}</Title>
                      <FeatureTypeStyle>`;
  }
}

export default ClassedPolygonsSld;
