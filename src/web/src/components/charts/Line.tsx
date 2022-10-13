import React, { createRef } from "react";
import * as d3 from "d3";

interface IProps {}

class LineChart extends React.Component<IProps, any> {
  private readonly svg: React.RefObject<SVGSVGElement>;

  constructor(props: IProps) {
    super(props);

    this.svg = createRef<SVGSVGElement>();
  }

  componentDidMount() {
    d3.select(this.svg.current);
  }

  render() {
    return <svg width={"100%"} height={"100%"} ref={this.svg} />;
  }
}

export default LineChart;
