import botImg from './musicBot.svg';
import GradientImg from '../../../commons/gradient/GradientImg'

function BotGraphic() {
    return (
        <div className="img-container">
            <GradientImg img={botImg} className="bot-img" alt="Discord Logo" />
        </div>
    );
}


function BotDesc() {
    return (
        <div className="desc-container">
            <p>A music bot for playing songs in Discord voice calls through youtube videos! Built on the Discord API, FFMPEG, and PyTube.</p>
            <a href='https://github.com/itsfeas/discord-music-bot' className="highlighted-text prj-link">Link to Repo</a>
        </div>
    );
}

export {
    BotGraphic,
    BotDesc
};