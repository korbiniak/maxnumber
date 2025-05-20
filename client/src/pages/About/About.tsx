import style from "./About.module.css";


export default function About(){



    return <div className={style.container}>


        <div className={style.aboutGame}>

     
            <h1>About Game</h1>
            
            <p>

            MaxNumber is a fast-paced and strategic math card game where numbers and operators collide in a battle of wits. <br/> 

            Each player starts with a single card showing the number 1. <br/> In alternating turns, players draw from a shared pool of cards—containing numbers or mathematical operations—and insert them into any position in their own or their opponent’s number sequence. <br/> 

            Once all the cards are used, the sequences are evaluated. <br/> The player whose final expression results in the highest number wins. <br/>

            What makes MaxNumber special is the freedom to manipulate not only your own number but also disrupt your opponent’s strategy. <br/> Every card placement counts, and even a small change can flip the entire game. <br/>

            Whether you're a fan of puzzles, strategy games, or just love numbers, MaxNumber offers a unique challenge that's easy to learn but hard to master. <br/>

            Sharpen your mind, outthink your opponent, and become the master of numbers!


            </p>

        </div>
    

        <div className={style.aboutFramal}>
            <h1>About Framal</h1>
            <p>
                My name is Franciszek Malinka, I’m a young programmer interested in Linux kernel, OCaml, bouldering, investing, music, my wife and coffee.
                I got BSc degree in Computer Science and Mathematics at the University of Wrocław (see my thesis). Currently I’m pursuing Masters in Computer Science. My main interests are fair division (field of algorithmic game theory), operating systems, Linux kernel, embedded programming.
            </p>

        </div>


        <div className={style.aboutMpdoge}>
            <h1>About Mpdoge</h1>
            <p>
                My name is Miłosz Popowicz. I'm programmer with math skills. In my free time I like playing Fortnite :D XD
            </p>

        </div>

        <div className={style.aboutTapik}>
            <h1>About Tapik</h1>
            <p>
            My name is Szymon Krzywda. I'm a competitive programmer with success in the Polish Olympiad in Informatics. In my free time, I enjoy web development and doing some math as well. I also volunteered at the Olympiad Computer Science Club (Olimpijskie Koło Informatyczne), where I helped young students prepare for the Olympiad.


            </p>

        </div>

     

    </div>
}