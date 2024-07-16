'use client'
import { useEffect } from "react"

export default function Game() {
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const gravity = 0.5;

    class Player {
      constructor() {
        this.position = {
          x: canvas.width * (1 / 10),
          y: 50,
        }
        this.velocity = {
          x: 0,
          y: 1,
        }

        this.width = 25;
        this.height = 25;
      }

      draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
      }

      update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= canvas.height - 10) {
          this.velocity.y += gravity;
        }
        else {
          this.velocity.y = 0;
        }

      }
    }

    class Platform {
      constructor({ x, y, image }) {
        this.position = {
          x,
          y,
        };
        this.image = image;

        this.width = image.width;
        this.height = image.height;

      }

      draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
      }
    }

    const player = new Player();

    //import image for platform
    const image = new Image();
    image.src = 'img/test.png';

    image.onload = () => {
      const platforms = [
        new Platform({ x: 0, y: 350, image }),
        new Platform({ x: 700, y: 350, image }),

      ];

      const keys = {
        right: {
          pressed: false
        },
        left: {
          pressed: false
        }
      }

      let scrollOffset = 0;

      //animation loop
      function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);

        platforms.forEach((platform) => {
          platform.draw();
        });
        player.update();

        //controls (left and right)
        if (keys.right.pressed && player.position.x < (canvas.width * 1 / 3)) {
          player.velocity.x = 5;
        }
        else if (keys.left.pressed && player.position.x > (canvas.width * 1 / 10)) {
          player.velocity.x = -5;
        }
        else {
          player.velocity.x = 0;
          if (keys.right.pressed) {
            platforms.forEach((platform) => {
              scrollOffset += 5;
              platform.position.x -= 5;
            })
          }
          else if (keys.left.pressed) {
            platforms.forEach((platform) => {
              scrollOffset -= 5;
              platform.position.x += 5;
            })
          }

        }
        console.log(scrollOffset);

        //platform collision detection
        platforms.forEach((platform) => {
          if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
          }
        })

        if (scrollOffset >= 2000) {
          console.log('You Win');
        }
      }

      animate();
      addEventListener('keydown', ({ key }) => {
        switch (key) {
          case 'a':
            keys.left.pressed = true;
            break;
          case 's':
            break;
          case 'd':
            keys.right.pressed = true;
            break;
          case 'w':
            player.velocity.y -= 10;
            break;
        }
      })
      addEventListener('keyup', ({ key }) => {
        switch (key) {
          case 'a':
            keys.left.pressed = false;
            break;
          case 's':
            break;
          case 'd':
            keys.right.pressed = false;
            break;
          case 'w':
            break;
        }
      })
    }

  }, []);
  return (
    <div className="flex h-screen items-center justify-center m-0">
      <canvas className="bg-white" style={{ width: '75%', height: '50%' }}></canvas>
    </div>
  );
}
