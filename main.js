const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field = [[]]) {
    this.field = field;
    this.locationX = 0;
    this.locationY = 0;
    // Set the "home" position before the game starts
    this.field[0][0] = pathCharacter;
  }

  runGame() {
    //Implement code
    let playing = true;
    while (playing) {
      this.print();
      this.askQuestion();
      if (!this.inField()) {
        console.log('You went out of the field! GAME OVER.');
        playing = false;
        break;
      } else if (this.isHole()) {
        console.log('Oops, you fell into a hole! GAME OVER.');
        playing = false;
        break;
      } else if (this.isHat()) {
        console.log('Yoohoo, you found your hat!');
        playing = false;
        break;
      } 
      
      // Update the current location on the map
      this.field[this.locationY][this.locationX] = pathCharacter;
    }
  }

  print() {
    clear();
    const displayString = this.field.map(row => {
        return row.join('');
      }).join('\n');
    console.log(displayString);
  }

  askQuestion() {
    const answer = prompt('Which way? ').toUpperCase();
    //Implement code
    switch (answer) {
      case 'U':
        this.locationY -= 1;
        break;
      case 'D':
        this.locationY += 1;
        break;
      case 'L':
        this.locationX -= 1;
        break;
      case 'R':
        this.locationX += 1;
        break;
      default:
        console.log('Enter U, D, L or R.');
        this.askQuestion();
        break;
    }
  }
  //Create method to check if player location is within bounds of field, return true/false
  //Used by runGame(). if false, game over
  inField() {
    return (
      this.locationY >= 0 && //top 
      this.locationX >= 0 && //left 
      this.locationY < this.field.length && //bottom 
      this.locationX < this.field[0].length //right
    );
  }

  //To check if character reaches hat
  isHat() {
    return this.field[this.locationY][this.locationX] === hat;
  }

  //To check if character reaches hole
  isHole() {
    return this.field[this.locationY][this.locationX] === hole;
  }

  static generateField(height, width, percentage = 0.1) {
    const field = new Array(height).fill(0).map(el => new Array(width));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        //Random probability variable
        const prob = Math.random();
        // As the for loop iterates through the arrays fill the current location with either '░' or 'O'
        // If probability is greater than percentage, fill with '░', else with hole 'O'
        field[y][x] = prob > percentage ? fieldCharacter : hole;
      }
    }
    // Set the "hat" location
    const hatLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };

    // Make sure "hat" is not at the starting point
    while (hatLocation.x === 0 && hatLocation.y === 0) {
      hatLocation.x = Math.floor(Math.random() * width);
      hatLocation.y = Math.floor(Math.random() * height);
    }
    field[hatLocation.y][hatLocation.x] = hat;
    return field;
  }
}

const myfield = new Field(Field.generateField(10, 10, 0.2));
myfield.runGame();