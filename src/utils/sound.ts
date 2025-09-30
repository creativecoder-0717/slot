import { Howl } from 'howler';

type SoundMap = Record<string, Howl>;

const sounds: SoundMap = {};

export const sound = {
    add: (alias: string, url: string): void => {
        if (sounds[alias]) return;
        sounds[alias] = new Howl({ src: [url] });
    },
    play: (alias: string): void => {
        const s = sounds[alias];
        if (!s) {
            // eslint-disable-next-line no-console
            console.warn(`Sound '${alias}' not found`);
            return;
        }
        s.play();
    },
    stop: (alias: string): void => {
        const s = sounds[alias];
        if (!s) return;
        s.stop();
    }
};
