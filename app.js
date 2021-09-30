var app = new Vue({
	el: '#app',
	data: {
		audio: '',
		imgLoaded: false,
		currentlyPlaying: false,
		currentlyStopped: false,
		currentTime: 0,
		checkingCurrentPositionInTrack: '',
		trackDuration: 0,
		currentProgressBar: 0,
		isPlaylistActive: false,
		currentSong: 0,
		debug: false,
		musicPlaylist: [
			{
				time: '3:16 |',
				title: 'Icona Pop',
				artist: "Sill Don't Know",
				url: '',
				image: 'http://eurochannel.com/images/stories/Icona_Pop_01.jpg',
			},
			{
				time: '2:35 |',
				title: 'Icona Pop',
				artist: 'I Love It',
				url: '',
				image:
					'https://www.tekstowo.pl/zdjecie_wykonawcy,icona_pop,aWNvbmFfcG9wXzRfNGQwOTNmM2NfMzMyNjQ4_1200_900_.jpg',
			},
			{
				time: '2:50 |',
				title: 'Icona Pop',
				artist: 'Girlfriend',
				url: '',
				image:
					'https://thefoxmagazine.com/wp-content/uploads/2019/07/01-icona-pop.jpg',
			},
			{
				time: '3:07 |',
				title: 'Icona Pop',
				artist: 'We Got The World',
				url: '',
				image:
					'https://media.gettyimages.com/photos/caroline-hjelt-and-aino-jawo-of-icona-pop-pose-in-the-exclusive-at-picture-id187605715?s=612x612',
			},
			{
				time: '3:24 |',
				title: 'Icona Pop',
				artist: 'Night Like This',
				url: '',
				image:
					'https://mustangnews.net/wp-content/uploads/2018/09/DmRWmm8UUAAK-MH.jpg',
			},
			{
				time: '3:08 |',
				title: 'Icona Pop',
				artist: 'All Night',
				url: '',
				image:
					'https://cdn.galleries.smcloud.net/t/galleries/gf-tSSv-ZP1t-TR6r_icona-pop-emergency-664x442.jpg',
			},
			{
				time: '2:50 |',
				title: 'Icona Pop',
				artist: 'Emergency',
				url: '',
				image:
					'https://cdn.aspentimes.com/wp-content/uploads/sites/5/2019/12/icona-atd-123019-2-1-711x1024.jpg',
			},
			{
				time: '2:52 |',
				title: 'Icona Pop',
				artist: 'Brightside',
				url: '',
				image:
					'https://scandipop.co.uk/wp-content/uploads/2012/05/iconapoprocket-e1337163480711.jpg',
			},
			{
				time: '2:44 |',
				title: 'Icona Pop',
				artist: 'Clap Snap',
				url: '',
				image:
					'https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=face&w=2000&h=1000&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F14%2F2016%2F11%2F15%2F111416-Icona-Pop-LEAD-2000.jpg',
			},
			{
				time: '3:12 |',
				title: 'Icona Pop',
				artist: 'On A Roll',
				url: '',
				image:
					'https://static.billboard.com/files/2020/03/Icona-Pop-press-by-Yoye-Lapogian-2020-billboard-1548-1583164013-compressed.jpg',
			},
		],
		audioFile: '',
	},
	mounted: function () {
		this.changeSong();
		this.audio.loop = false;
	},
	filters: {
		fancyTimeFormat: function (s) {
			return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
		},
	},
	methods: {
		togglePlaylist: function () {
			this.isPlaylistActive = !this.isPlaylistActive;
		},
		nextSong: function () {
			if (this.currentSong < this.musicPlaylist.length - 1)
				this.changeSong(this.currentSong + 1);
		},
		prevSong: function () {
			if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
		},
		changeSong: function (index) {
			var wasPlaying = this.currentlyPlaying;
			this.imageLoaded = false;
			if (index !== undefined) {
				this.stopAudio();
				this.currentSong = index;
			}
			this.audioFile = this.musicPlaylist[this.currentSong].url;
			this.audio = new Audio(this.audioFile);
			var localThis = this;
			this.audio.addEventListener('loadedmetadata', function () {
				localThis.trackDuration = Math.round(this.duration);
			});
			this.audio.addEventListener('ended', this.handleEnded);
			if (wasPlaying) {
				this.playAudio();
			}
		},
		isCurrentSong: function (index) {
			if (this.currentSong == index) {
				return true;
			}
			return false;
		},
		getCurrentSong: function (currentSong) {
			return this.musicPlaylist[currentSong].url;
		},
		playAudio: function () {
			if (
				this.currentlyStopped == true &&
				this.currentSong + 1 == this.musicPlaylist.length
			) {
				this.currentSong = 0;
				this.changeSong();
			}
			if (!this.currentlyPlaying) {
				this.getCurrentTimeEverySecond(true);
				this.currentlyPlaying = true;
				this.audio.play();
			} else {
				this.stopAudio();
			}
			this.currentlyStopped = false;
		},
		stopAudio: function () {
			this.audio.pause();
			this.currentlyPlaying = false;
			this.pausedMusic();
		},
		handleEnded: function () {
			if (this.currentSong + 1 == this.musicPlaylist.length) {
				this.stopAudio();
				this.currentlyPlaying = false;
				this.currentlyStopped = true;
			} else {
				this.currentlyPlaying = false;
				this.currentSong++;
				this.changeSong();
				this.playAudio();
			}
		},
		onImageLoaded: function () {
			this.imgLoaded = true;
		},
		getCurrentTimeEverySecond: function (startStop) {
			var localThis = this;
			this.checkingCurrentPositionInTrack = setTimeout(
				function () {
					localThis.currentTime = localThis.audio.currentTime;
					localThis.currentProgressBar =
						(localThis.audio.currentTime / localThis.trackDuration) * 100;
					localThis.getCurrentTimeEverySecond(true);
				}.bind(this),
				1000
			);
		},
		pausedMusic: function () {
			clearTimeout(this.checkingCurrentPositionInTrack);
		},
		toggleDebug: function () {
			this.debug = !this.debug;
			document.body.classList.toggle('debug');
		},
	},
	watch: {
		currentTime: function () {
			this.currentTime = Math.round(this.currentTime);
		},
	},
	beforeDestroy: function () {
		this.audio.removeEventListener('ended', this.handleEnded);
		this.audio.removeEventListener('loadedmetadata', this.handleEnded);

		clearTimeout(this.checkingCurrentPositionInTrack);
	},
});
