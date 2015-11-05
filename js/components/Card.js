'use strict';

// A draggable card
// drag drop code example used: https://github.com/brentvatne/react-native-animated-demo-tinder
// panresponder docs: https://facebook.github.io/react-native/docs/panresponder.html

let React = require('react-native');
let {
  Animated, 
  PanResponder,
  StyleSheet,
  Text,
  View,
} = React;

let { connect } = require('react-redux');
let clamp = require('clamp');
let styles = require('../styles');

var SWIPE_THRESHOLD = 120;

let Card = connect()(React.createClass({

  componentWillMount: function() {

    this.state = {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(1),
    }

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
                 Animated.spring(this.state.enter, {
            toValue: .75,
          }).start()

        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
         
         let distanceToBoard = styles.cardHeight + styles.cardHeight;
         if(Math.abs(this.state.pan.y._value) >= distanceToBoard) {
           let playAction = {type:'play', cardId:this.props.info.id, player:this.props.player};
           this.props.dispatch(playAction);
           this.props.socket.send(playAction);
           return;
         }
         let toValue = 0;         
         Animated.spring(this.state.enter, {
            toValue: 1,
          }).start()

        this.state.pan.flattenOffset();
        var velocity;

        if (vx >= 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        }

        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          Animated.decay(this.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.98
          }).start(this._resetState)
        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: toValue},
            friction: 4
          }).start()
        }
      }
    })
  },

  render: function() {

    let name = '';
    let attack = '';
    let defense = '';
    if(this.props.info) {
      name = this.props.info['name'];
      attack = this.props.info['attack'];
      defense = this.props.info['defense'];
    }

    let { pan, enter, } = this.state;
    let [translateX, translateY] = [pan.x, pan.y];
    let scale = enter;
    let animatedCardStyles = {transform: [{translateX}, {translateY}, {scale}]};
 
    return (
      <Animated.View style={[cardStyles.container, animatedCardStyles]} {...this._panResponder.panHandlers}>
        <Text>
           {name}
        </Text>
        <View style={[cardStyles.flexFill]}></View>
        <View style={[cardStyles.cardStatsContainer]}>
          <View style={[cardStyles.attackBackground]}>
            <Text>
               {attack}
            </Text>
          </View>
          <View style={[cardStyles.flexFill]}></View>
          <View style={[cardStyles.defenseBackground]}>
            <Text>
             {defense}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }
}));

let cardStyles = StyleSheet.create({
  cardStatsContainer: {
    flexDirection: 'row',
  },  
  attackBackground: {
    backgroundColor: 'gray',
  },
  defenseBackground: {
    backgroundColor: 'red',
  },
  flexFill: {
    flex: 1,
  },  
  container: {
    height: styles.cardHeight,
    width: styles.cardWidth,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
  }
});

module.exports = Card;
