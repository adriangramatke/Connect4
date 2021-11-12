import React, { Component } from 'react';
import './App.css';

export default class App extends React.Component {
  state = {
    rows: 6,
    columns: 7,
    moves: [],
    playerTurn: 'red'
  };

  //Resets board and all player moves
  resetBoard = () => {
    this.setState({
      moves: [], winner: null
    });
  }

  //Returns location of a piece
  getPiece = (x, y) => {
    const list = this.state.moves.filter((item) => {
      return item.x === x && item.y === y;
    });
    return list[0];
  }

  //Checks status of individual player pieces to determine if there is a win
  returnWinningMoves = (xPosition, yPosition, xLocation, yLocation) => {
    const winningMoves = [{x: xPosition, y: yPosition}];
    const player = this.getPiece(xPosition, yPosition).player;

    for (let i = 1; i <= 3; i += 1) {
      const checkX = xPosition + (xLocation * i);
      const checkY = yPosition + (yLocation * i);

      const checkPiece = this.getPiece(checkX, checkY);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: checkX, y: checkY})
      } else {
        break;
      }
    }
    
    for (let n = -1; n >= -3; n -= 1) {
      const checkX = xPosition + (xLocation * n);
      const checkY = yPosition + (yLocation * n);

      const checkPiece = this.getPiece(checkX, checkY);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: checkX, y: checkY})
      } else {
        break;
      }
    }
    return winningMoves;
  }

  //Checks board to see if either player has won and if so returns the winner
  checkForWin = (x, y) => {
    const locations = [{x: 1, y: 0}, {x: 0, y: 1}]
    for (let dex = 0; dex < locations.length; dex++) {
      const element = locations[dex];
      const winningMoves = this.returnWinningMoves(x, y, element.x, element.y);
      if (winningMoves.length > 3) {
        this.setState({winner: this.getPiece(x, y).player, winningMoves});
      }
    }
  }

  //When player clicks on board adds their move to the board and switches the players turns and checks if the piece played was a winning piece
  addMove = (x, y) => {
    const {playerTurn} = this.state;
    const nextPlayerTurn = playerTurn === 'red' ? 'yellow' : 'red';
    let availableYPosition = null;
    for (let position = this.state.rows - 1; position >= 0; position--) {
      if (!this.getPiece(x, position)) {
        availableYPosition = position;
        break;
      }
    }
    if (availableYPosition !== null) {
     this.setState({moves: this.state.moves.concat({x, y: availableYPosition, player: playerTurn}), playerTurn: nextPlayerTurn},
      () => this.checkForWin(x, availableYPosition, playerTurn))
    }
  }

  //Initiliazes the board set up from the start
  renderBoard() {
    const {rows, columns, winner} = this.state;
    const rowViews = [];
  
    for (let row = 0; row < this.state.rows; row += 1) {
      const columnViews = [];
      for (let column = 0; column < this.state.columns; column += 1) {
        const piece = this.getPiece(column, row);
        columnViews.push(
          <div onClick = {() => {this.addMove(column, row)}} style = {{width: '100px', height: '100px', backgroundColor: '00a8ff', display: 'flex', padding: 1, cursor: 'pointer'}}>
            <div style = {{borderRadius: '0%', backgroundColor: 'white', flex: 1, display: 'flex'}}>
              {piece ? <div style = {{backgroundColor: piece.player, flex: 1, borderRadius: '0%', border: '1px solid #333'}}/> : undefined}
          </div>
        </div>
        );
      }
      rowViews.push(
        <div style = {{ display: 'flex', flexDirection: 'row'}}>{columnViews}</div>
      );
    }
    
    return (
      <div style={{backgroundColor: 'black', display: 'flex', flexDirection:'column'}}>
      {winner && <div onClick={this.resetBoard} style={{ position: 'absolute', left:0, right: 0, bottom: 0, top: 0, zIndex: 3, backgroundColor: 'rgba(0, 0, 0, .5)' , display: 'flex', 
      justifyContent: 'center', alignItems:'center', color: '#fff', fontWeight: '200', fontSize: '100px' }}>{winner + ' wins!'}</div> }
      {rowViews}
      </div>
    );
  }
  
  //Overhead function that uses renderBoard() to render the game board
  render() {
    const {style}=this.props;
    return (
        <div style={style?Object.assign({},styles.container,style): styles.container}>
        <div>
            {this.renderBoard()}
            <button onClick = {this.resetBoard}>Clear Board</button>
        </div>
        </div>
    ); 
}
}

const styles = {
    contatainer: {
    height: '100%',
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};
