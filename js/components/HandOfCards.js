'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
} = React;

let { connect } = require('react-redux');
let styles = require('../styles');
let Card = require('./Card');

let HandOfCards = connect()(React.createClass({
  render: function() {
    let handCards;
    if (this.props.cards) {
      handCards = this.props.cards.map((cardInfo, i) =>
        <Card info={cardInfo} username={this.props.username} />
      );
    }
    return (
      <View style={[handStyles.container]}>
          {handCards}
      </View>
    );
  }
}));

let handStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'pink',
    height: styles.cardHeight,
  }
});

module.exports = HandOfCards;
