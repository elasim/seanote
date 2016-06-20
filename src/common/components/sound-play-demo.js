import React, { Component } from 'react';
const SFX_TRASH = require('../../../assets/sfx/trash.wav');

// experimental feature
class Test extends Component {
	componentDidMount() {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		const context = new AudioContext();
		this._context = context;
		console.log(SFX_TRASH);
		const xhr = new XMLHttpRequest();
		xhr.open('GET', SFX_TRASH, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = async (data) => {
			// Check Some Error
			const val = xhr.response;
			const buffer = await context.decodeAudioData(xhr.response);
			this._buffer = buffer;
			this._gain = context.createGain();
			this._gain.gain.volume = 0.5;
			this._gain.connect(context.destination);
		};
		xhr.send();
	}
	componentWillUnmount() {
		this._context.close();
	}
	play() {
		const source = this._context.createBufferSource();
		source.buffer = this._buffer;
		source.connect(this._gain);
		source.start(0);
	}
	render() {
		return <button type='type' onClick={::this.play} >Hi</button>;
	}
}
