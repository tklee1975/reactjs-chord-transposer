//
//  Chord Transposer using
//
//  Author:   kencoder
//  Twitter:  https://twitter.com/kenlakoo
//  Facebook: https://www.facebook.com/kencoder.hk.9
//

//
// Constant
//
const CHORD_A   = 0;
const CHORD_Bb  = 1;
const CHORD_B   = 2;
const CHORD_C   = 3;
const CHORD_Cs  = 4;
const CHORD_D   = 5;
const CHORD_Eb  = 6;
const CHORD_E   = 7;
const CHORD_F   = 8;
const CHORD_Fs  = 9;
const CHORD_G   = 10;
const CHORD_Gs  = 11;

const CHORD_NAME = ["A", "Bb", "B", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#"];

var CHORD_ARRAY;
var CAPO_ARRAY;

/// Helper method
function chordToStr(chord) {
  return CHORD_NAME[chord];
}

var OptionsBox = React.createClass({
	getSelectedValue : function() {
		return this.refs.selectBox.value;
	},

	render: function() {
		return (
			<select ref="selectBox" className={this.props.className}
       defaultValue={this.props.defaultValue} onChange={this.props.onChange} value={this.props.value}>
		     {
		       this.props.data.map(function(opt) {
		         return <option value={opt.value}>{opt.caption}</option>;
		       })
		     }
		   </select>
		);
	}
});


var ChordOptions = React.createClass({
  getSelectedValue : function() {
		return this.refs.selectBox.value;
	},

	render: function() {
		return (
			<select ref="selectBox" className={this.props.className} value={this.props.value}
      defaultValue={this.props.defaultValue} onChange={this.props.onChange}>
		     {
		       CHORD_ARRAY.map(function(opt) {
		         return <option value={opt.value}>{opt.caption}</option>;
		       })
		     }
		   </select>
		);
	}
});

function modifyChord(chordValue)
{
  if(chordValue < 0) {
    chordValue = 12 - chordValue;
  }

  return (chordValue % 12)
}

/// Chord Table
var ChordTable = React.createClass({
  render: function() {
    var chordDiff = this.props.playChord - this.props.songChord;


    var rowArray = [];

    var chord = this.props.songChord;
    for(var i=0; i<12; i+=2) {
      var songChord1 = chord;
      var songChord2 = chord+1;

      console.debug("chord=" + chord + " songChord1=" + songChord1);

      var playChord1 = modifyChord(songChord1 + chordDiff);
      var playChord2 = modifyChord(songChord2 + chordDiff);



      console.debug("playChord1=" + playChord1 + " playChord2=" + playChord2);
      var songChordStr1 = chordToStr(modifyChord(songChord1));
      var songChordStr2 = chordToStr(modifyChord(songChord2));
      var playChordStr1 = chordToStr(playChord1);
      var playChordStr2 = chordToStr(playChord2);

      //
      var row = { songChord1 : songChordStr1, playChord1 : playChordStr1,
                  songChord2 : songChordStr2, playChord2 : playChordStr2};
      rowArray.push(row);

      // next loop
      chord += 2;
    }

    var tableRow = rowArray.map(
				function(data) {
					return (
            <tr>
              <td className="chord-cell"><b>{data.songChord1}</b> → <b>{data.playChord1}</b></td>
              <td className="chord-cell"><b>{data.songChord2}</b> → <b>{data.playChord2}</b></td>
            </tr>
          );
				}
		);

    return (
        <div className="chord-table">
          <table style={{width: 300, margin: 'auto'}}>
            <tbody>
            {tableRow}
            </tbody>
          </table>
        </div>
      );
    }
});


/// Chord Table
// note: songChord = playChord + capo
var ChordControl = React.createClass({
  getInitialState: function() {
      return {
        songChord: CHORD_Cs,
        playChord: CHORD_C,
        capo: 1,
      };
  },

  getChordInfo: function() {
    return {
      songChord: this.state.songChord,
      playChord: this.state.playChord,
    };
  },

  onSongChordChange: function() {
    // Song: Change the Capo Value
    //
    var songChord = this.refs.songChord.getSelectedValue();
    var playChord = this.refs.playChord.getSelectedValue();
    var newCapo =  songChord - playChord;
    if(newCapo < 0) {
      newCapo = 12 + newCapo;
    }

    // console.log("songChord: " + this.refs.songChord.getSelectedValue());
    this.setState(
      {
        capo: newCapo,
        songChord: songChord
      }
    );
    // console.debug("songChord=" + songChord + " playChord=" + playChord + " newCapo=" + newCapo);
    this.props.onUpdate({songChord: songChord, playChord: playChord});
  },

  onCapoChange: function() {
    console.log("playChord: " + this.refs.songChord.getSelectedValue());
    // note: songChord = playChord + capo

    var newCapo = this.refs.capo.getSelectedValue();
    var playChord = this.refs.playChord.getSelectedValue();
    var newSongChord = modifyChord(playChord + newCapo);

    // console.log("songChord: " + this.refs.songChord.getSelectedValue());
    this.setState(
      {
        capo: newCapo,
        songChord: newSongChord,
      }
    );
    // console.debug("songChord=" + songChord + " playChord=" + playChord + " newCapo=" + newCapo);
    this.props.onUpdate({songChord: newSongChord, playChord: playChord});
  },

  onPlayChordChange: function() {
    console.log("Capo: " + this.refs.capo.getSelectedValue());

    var songChord = this.refs.songChord.getSelectedValue();
    var playChord = this.refs.playChord.getSelectedValue();
    var newCapo =  songChord - playChord;
    if(newCapo < 0) {
      newCapo = 12 + newCapo;
    }

    // console.log("songChord: " + this.refs.songChord.getSelectedValue());
    this.setState(
      {
        capo: newCapo,
        playChord: playChord
      }
    );
    // console.debug("songChord=" + songChord + " playChord=" + playChord + " newCapo=" + newCapo);
    this.props.onUpdate({songChord: songChord, playChord: playChord});
  },

  render: function() {
    var songChords = <ChordOptions ref="songChord" className="center-me option-box"
                onChange={this.onSongChordChange} value={this.state.songChord}/>
    var playChords = <ChordOptions ref="playChord" className="play-option-item option-box"
                onChange={this.onPlayChordChange} value={this.state.playChord}/>
    var capos = <OptionsBox ref="capo" data={CAPO_ARRAY}
                onChange={this.onCapoChange} value={this.state.capo}
                className="play-option-item option-box"/>


    return (

      <div className="chord-control">
        <div className="left-box">
          <div className="center-text-content" style={{height: 30}}>Song</div>
          <div style={{position: 'relative', height: 50}}>
            {songChords}
          </div>
        </div>
        <div className="right-box">
          <div className="center-text-content" style={{height: 30}}>Play</div>
          <div className="play-option-box" style={{position: 'relative', height: 50}}>
            {playChords}
            {capos}
          </div>
        </div>
      </div>
    );
  }
});

//
//  The Main Timer Component
//

var ChordTransposer = React.createClass({
  getInitialState: function() {
    console.log("debug, ChordTransposer is loaded");

    return {
      songChord: CHORD_Cs,
      playChord: CHORD_C,
    };
  },


  componentDidMount: function() {
  },

  onChordControlUpdated: function(newState) {
    var newSongChord = parseInt(newState['songChord']);
    var newPlayChord = parseInt(newState['playChord']);
    console.log("newState: " + newState + " song: " + newSongChord + " play: " + newPlayChord);
    this.setState(
      {
        songChord: newSongChord,
        playChord: newPlayChord,
      }
    );
  },

  render: function() {
    var control = <ChordControl ref="control" onUpdate={this.onChordControlUpdated}/>
    var display = <ChordTable songChord={this.state.songChord} playChord={this.state.playChord}/>;

    return <div className="ChordTransposer">
    {control}
    {display}
    </div>
  }
});

function setupCapoArray() {
  CAPO_ARRAY = [];
  for(var capo=0; capo<=12; capo++) {
    var data = {
      value : capo,
      caption : capo == 0 ? "No Capo" : "Capo" + capo
    };

    CAPO_ARRAY.push(data);
  }
}

// Starting
function setupChordArray() {
  CHORD_ARRAY = [];

  for(var chord = CHORD_A; chord <= CHORD_Gs; chord++) {
    var data = {
      value : chord,
      caption : chordToStr(chord)
    }

    CHORD_ARRAY.push(data);
  }
}


$(document).ready(function() {
    console.log("debug, page is loaded");

    setupChordArray();
    setupCapoArray();
})

// -------------------------
//
// Rendering
//
// -------------------------
// ReactDOM.render(<TimerTest/>, document.getElementById('TimerTest'));
ReactDOM.render(<ChordTransposer/>, document.getElementById('ChordTransposer'));
