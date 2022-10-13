import './styles/Solution.css'
function waitForLoad(id, callback) {
    var timer = setInterval(function () {
        if (document.getElementById(id)) {
            clearInterval(timer);
            callback();
        }
    }, 100);
}

function Solution() {
    waitForLoad('line1', function () {
        var slider = document.getElementById('slider');
        var active = document.getElementById('active');
        console.log("load successful, you can proceed!!");
        document.getElementById('line1').onclick = function () {
            slider.style.transform = 'translateX(0)';
            active.style.top = '0px';
        }
    });

    waitForLoad('line2', function () {
        var slider = document.getElementById('slider');
        var active = document.getElementById('active');
        document.getElementById('line2').onclick = function () {
            slider.style.transform = 'translateX(-25%)';
            active.style.top = '80px';
        }
    });

    waitForLoad('line3', function () {
        var slider = document.getElementById('slider');
        var active = document.getElementById('active');
        document.getElementById('line3').onclick = function () {
            slider.style.transform = 'translateX(-50%)';
            active.style.top = '160px';
        }
    });

    waitForLoad('line4', function () {
        var slider = document.getElementById('slider');
        var active = document.getElementById('active');
        document.getElementById("line4").onclick = function () {
            slider.style.transform = 'translateX(-75%)';
            active.style.top = '240px';
        }
    });
    return (

        <div className="body_solution">
            <div className="container_solution">
                <div className="msg-container">
                    <div id="slider">
                        <div className="msg-col">
                            <h1>Un langage accessible</h1>
                            <p>Lorem ipsum dolor sit amet consecteturlique omnis error blanditiis exonsequuntur ducimus, harum quidem consequatur sequi inventore rerum.
                                Delectus quae hic nemo, minima sit quo atque possimus act qui ut quas perferendis itaque sapiente.</p>
                            <a href='/'> En savoir plus</a>
                        </div>
                        <div className="msg-col">
                            <h1>Nous apprenons à vous connaître</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatcimus, harum quidem consequatur sequi inventore rerum.
                                Delectus quae hic nemo, minima sit quo atque possimus aqui ut quas perferendis itaque sapiente.</p>
                            <a href='/'> En savoir plus</a>
                        </div>
                        <div className="msg-col">
                            <h1>Un revenue Passif qui vous rend actif</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates nr sequi inventore rerum.
                                uos sed quasi, iure ad sint voluptas! Corporis unde quidem quibusdam, accusamus amet qui ut quas perferendis itaque sapiente.</p>
                            <a href='/'> En savoir plus</a>
                        </div>
                        <div className="msg-col">
                            <h1>Tenez-vous à jour</h1>
                            <p>Lorem ipsum iusto! Similique omnis erronulla  dventore rerum.
                                Delectus quae hic nemo, minima sit quo atque possimus nt nde quidem quibusdam, accusamus amet qui ut quas perferendis itaque sapiente.</p>
                            <a href='/'> En savoir plus</a>
                        </div>
                    </div>
                </div>
                <div className="controller">
                    <div id="line1"></div>
                    <div id="line2"></div>
                    <div id="line3"></div>
                    <div id="line4"></div>
                    <div id="active"></div>
                </div>
            </div>
        </div>
    )
}
export default Solution;