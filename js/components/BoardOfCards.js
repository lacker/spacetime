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

let BoardOfCards = connect()(React.createClass({
  render: function() {
    console.log("112")
    let boardCards;
    if (this.props.cards) {
      boardCards = this.props.cards.map((cardInfo, i) =>
        <Card key={i} info={cardInfo} player={this.props.player} />
      );
    }
    console.log("1234")
    console.log(boardCards)
    return (
      <View style={[boardStyles.container]}>
          {boardCards}
      </View>
    );
  }
}));

let boardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: styles.cardHeight,
  }
});

module.exports = BoardOfCards;
