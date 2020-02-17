import React, { Component, Fragment } from "react";

import { Text, View, Animated, Dimensions } from 'react-native';

import SlidingUpPanel from "rn-sliding-up-panel";

import PropTypes from "prop-types";
import "./PlanPanel.css";

const { height } = Dimensions.get("window");

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center"
  },
  panel: {
    flex: 1,
    backgroundColor: "white",
    position: "relative"
  },
  panelHeader: {
    height: 180,
    backgroundColor: "#b197fc",
    justifyContent: "flex-end",
    padding: 24
  },
  textHeader: {
    fontSize: 28,
    color: "#FFF"
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -24,
    right: 18,
    width: 48,
    height: 48,
    zIndex: 1
  },
  iconBg: {
    backgroundColor: "#2b8a3e",
    position: "absolute",
    top: -24,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    zIndex: 1
  }
};

class PlanPanel extends Component {
    static defaultProps = {
        draggableRange: { top: height + 180 - 64, bottom: 180 }
      };
    
      _draggedValue = new Animated.Value(180);

    state = {
    };

    componentDidMount() {
    }

    loadRatings = () => {
        const { planId } = this.props;
    };

    render() {
        const {
            planId
        } = this.state;

        const { top, bottom } = this.props.draggableRange;

    const backgoundOpacity = this._draggedValue.interpolate({
      inputRange: [height - 48, height],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });

    const iconTranslateY = this._draggedValue.interpolate({
      inputRange: [height - 56, height, top],
      outputRange: [0, 56, 180 - 32],
      extrapolate: "clamp"
    });

    const textTranslateY = this._draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [0, 8],
      extrapolate: "clamp"
    });

    const textTranslateX = this._draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [0, -112],
      extrapolate: "clamp"
    });

    const textScale = this._draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [1, 0.7],
      extrapolate: "clamp"
    });
        
        return (
            <Fragment>
                <div>Test for plan panel</div>
                <SlidingUpPanel
          ref={c => (this._panel = c)}
          draggableRange={this.props.draggableRange}
          animatedValue={this._draggedValue}
          snappingPoints={[360]}
          height={height + 180}
          friction={0.5}
        >
          <View style={styles.panel}>
            <Animated.View
              style={[
                styles.iconBg,
                {
                  opacity: backgoundOpacity,
                  transform: [{ translateY: iconTranslateY }]
                }
              ]}
            />
            <View style={styles.panelHeader}>
              <Animated.View
                style={{
                  transform: [
                    { translateY: textTranslateY },
                    { translateX: textTranslateX },
                    { scale: textScale }
                  ]
                }}
              >
                <Text style={styles.textHeader}>Sliding Up Panel</Text>
              </Animated.View>
            </View>
            <View style={styles.container}>
              <Text>Bottom sheet content</Text>
            </View>
          </View>
        </SlidingUpPanel>
            </Fragment>
        );
    }
}

PlanPanel.propTypes = {
    planId: PropTypes.number,
    me: PropTypes.object
};

export default PlanPanel;
