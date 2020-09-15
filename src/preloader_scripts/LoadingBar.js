export default class LoadingBar {
    constructor(pointer) {
        this.pointer = pointer;
    }

    // LOADING BAR
    displayProgress() {
        // Draw progress bar
        const width = this.pointer.cameras.main.width;
        const height = this.pointer.cameras.main.height;
        let progressBar = this.pointer.add.graphics();
        let progressBox = this.pointer.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(292, 465, 320, 50);
        
        // Show user that the game is loading
        const loadingText = this.pointer.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
                }

            });

        loadingText.setOrigin(0.5, 0.5);

        // Display what % of the game assets have loaded
        const percentText = this.pointer.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });

        // Update what file is being loaded
        const assetText = this.pointer.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        // Position text
        assetText.setOrigin(0.5, 0.5);
        percentText.setOrigin(0.5, 0.5);

        // Fill the progress bar as more assets are loaded
        this.pointer.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(300, 475, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
            
        });
        
        // Update file progress displayed text
        this.pointer.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });
        
        // After loading is finished, remove
        this.pointer.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }
}