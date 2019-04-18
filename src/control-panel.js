import React, {PureComponent} from 'react';

const defaultContainer =  ({children}) => <div className="control-panel">{children}</div>;

export default class ControlPanel extends PureComponent {
  render() {
    const Container = this.props.containerComponent || defaultContainer;
    const {settings} = this.props;

    return (
      <Container>
        <h3>Controls</h3>

        <button className="input" onClick={() => { this.props.onIntersect() }}> Intersect </button>
        <button className="input" onClick={() => { this.props.onUnion() }}> Union </button>
      </Container>
    );
  }
}
