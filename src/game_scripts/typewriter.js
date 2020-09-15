import { gamePlay } from '../config/gameConfig';

/**
 *
 * @param {string} text
 * @param {number} delay - How long to wait before adding text
 * @param {ThisType} pointer
 */
const typewriteBitmapText = (text, delay, pointer) =>
{
    pointer.time.addEvent({
        callback: () => {
            console.log(gamePlay.globalTimer);
            // Add sound effect when each letter is added
            pointer.typewriterSound = pointer.sound.add('typewriter', {volume: 0.6});
            //Set the text and length of text
            pointer.bitmapLabel.setText(text)
            const bounds = pointer.bitmapLabel.getTextBounds(false)
            const wrappedText = bounds['wrappedText'] || text
        
            //Clear the text first
            pointer.bitmapLabel.setText('')
        
            // Get length
            const length = wrappedText.length
            let i = 0
            // Add text at set delay speed
            pointer.time.addEvent({
                callback: () => {
                    pointer.bitmapLabel.text += wrappedText[i]
                    pointer.typewriterSound.play();
                    ++i
                },
                repeat: length - 1,
                delay: 70
            });
            // Clear text after a little bit of time has passed
            pointer.time.addEvent({
                callback: () => {
                    pointer.bitmapLabel.text = '';
                },
                repeat: 0,
                delay: 3000
            });

        },
        repeat: 0,
        delay: delay * 700
    });
}

export { typewriteBitmapText }