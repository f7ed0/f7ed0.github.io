import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss'],
  host: {'(body:click)':'tool_selected_id=-1'}
})
export class MainpageComponent implements OnInit, AfterViewInit {

  three_container!: Element | null

  fp_opacity = 1
  header_opacity = "#10101000"
  spacing3d = 0
  hop = 0

  dark_theme:boolean = true;

  tool_selected_id:number = -1

  cubes: { mesh: THREE.Mesh, max_height: number, initial_x:number}[] = []
  renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({antialias:true});
  scene: THREE.Scene = new THREE.Scene();
  camera!: THREE.PerspectiveCamera
  clock:THREE.Clock = new THREE.Clock();
  delta:number = 0;
  interval:number = 1/60;



  onScroll($event:Event) {
    //@ts-expect-error
    this.fp_opacity = Math.max(0,window.innerHeight/4 - $event.target.scrollTop)/(window.innerHeight/4)
    //@ts-expect-error
    this.spacing3d = Math.min(Math.max(0,($event.target.scrollTop/(window.innerHeight))*1.5),1)
    //@ts-expect-error
    this.hop = Math.ceil(Math.max(0,Math.min( (($event.target.scrollTop - (window.innerHeight)*0.2)-(window.innerHeight)*0.55)/((window.innerHeight)*0.2), 1))*255)
    const alpha = (this.hop).toString(16).length > 1 ? (this.hop).toString(16) : "0"+(this.hop).toString(16)
    console.log(alpha)
    if(this.dark_theme) {
      this.header_opacity = `#101010${alpha}`
    } else {
      
      this.header_opacity = `#ECE8EF${alpha}`
    }
  }

  get box() {
    if (this.three_container)
      return { height: this.three_container.clientHeight, width: this.three_container.clientWidth }
    return { height: 0, width: 0 }
  }

  ngOnInit() {
    if(this.dark_theme) {
      this.header_opacity = "#10101000"
    } else {
      this.header_opacity = "#ECE8EF00"
    }
  }

  ngAfterViewInit() {
    this.init3D()
  }



  // -----------------------------------------------------------------------------------------------

  public grabbed3D:boolean = false
  public oldMousePos:{y:number,time:number}|undefined = undefined
  public speed3D:number = 0.3

  private init3D() {
    this.three_container = document.querySelector("#treeHolder")

    this.camera = new THREE.PerspectiveCamera(75, this.box.width / this.box.height, 0.1, 1000);

    this.renderer.setSize(this.box.width, this.box.height);
    if(this.dark_theme) {
      this.renderer.setClearColor(0x101010)
    } else {
      this.renderer.setClearColor(0xECE8EF)
    }
    
    let el = this.three_container?.appendChild(this.renderer.domElement);

    const colors_dark = [
      new THREE.Vector3(0xf1/0xff,0xf6/0xff,0xfb/0xff),
      new THREE.Vector3(0xf1/0xff,0xf6/0xff,0xfb/0xff),
      new THREE.Vector3(0xf1/0xff,0xf6/0xff,0xfb/0xff),
      new THREE.Vector3(0xf1/0xff,0xf6/0xff,0xfb/0xff), 
      new THREE.Vector3(0xf1/0xff,0xf6/0xff,0xfb/0xff), 
      new THREE.Vector3(0xd6/0xff,0xba/0xff,0x73/0xff), 
      new THREE.Vector3(0xca/0xff,0x66/0xff,0x80/0xff)
    ]

    const colors = [
      new THREE.Vector3(0x01/0xff,0x01/0xff,0x01/0xff),
      new THREE.Vector3(0x01/0xff,0x01/0xff,0x01/0xff),
      new THREE.Vector3(0x01/0xff,0x01/0xff,0x01/0xff),
      new THREE.Vector3(0x01/0xff,0x01/0xff,0x01/0xff), 
      new THREE.Vector3(0x01/0xff,0x01/0xff,0x01/0xff), 
      new THREE.Vector3(0x43/0xff,0x92/0xff,0xf1/0xff), 
      new THREE.Vector3(0xdc/0xff,0x49/0xff,0x3a/0xff)
    ]

    for (let i = 0; i <= 11;i++) {
      for (let j = -8; j <= 8; j++) {
        if (j != 0) {
          const height = (Math.random() * 20 + 10) * 2
          const width = Math.random() * 5.5 + 5
          const color_pick = Math.floor(Math.random() * 7)
          const geometry = new THREE.BoxGeometry(width, height, width);
          const material = new THREE.ShaderMaterial({
            uniforms: {
              size: {
                value: new THREE.Vector3(geometry.parameters.width, geometry.parameters.height, geometry.parameters.depth).multiplyScalar(0.5)
              },
              thickness: {
                value: 0.3
              },
              smoothness: {
                value: 0.002
              },
              color : {
                value : this.dark_theme ? colors_dark[color_pick] : colors[color_pick]
              }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
          })
          const x = ((10 * j)) + ((Math.abs(j) - 1)*(Math.abs(j) - 1) + (j * j) + 2) * Math.sign(j)
          this.cubes.push({ mesh: new THREE.Mesh(geometry, material), max_height: height, initial_x:x })
          this.cubes[this.cubes.length - 1].mesh.translateZ((15 * i) - width / 2 )
          this.cubes[this.cubes.length - 1].mesh.translateX(x)
          this.cubes[this.cubes.length - 1].mesh.translateY(height / 2)
          this.scene.add(this.cubes[this.cubes.length - 1].mesh);
        }

      }
    }

    this.camera.position.z = 0;
    this.camera.position.y = 50;
    this.camera.lookAt(new THREE.Vector3(0, 0, 95))
    console.log(this.cubes[0].mesh)
    this.animate()
  }

  public animate() {
    requestAnimationFrame(() => this.animate());
    this.delta += this.clock.getDelta();
  
    if (this.delta  > this.interval) {
      this.camera.aspect = this.box.width / this.box.height

      this.renderer.setSize(this.box.width, this.box.height)
      if(Math.abs(this.speed3D) > 60) this.speed3D = 60
      for (let cube of this.cubes) {
        
        cube.mesh.position.z = (cube.mesh.position.z - this.speed3D + 180) % 180;

        cube.mesh.position.x = cube.initial_x + (Math.sign(cube.initial_x)*(this.box.width/2)*Math.pow(this.spacing3d,5))/6
        

        //cube.mesh.material.opacity = Math.cos(Math.pow((cube.position.z/190),10)*(Math.PI/2))

        const wave = Math.sin(Math.pow((cube.mesh.position.z / 180), 1.5) * (Math.PI)) * 0.8 + 0.2

        cube.mesh.scale.y = wave
        cube.mesh.position.y = wave * cube.max_height / 2
      }

      this.renderer.render(this.scene, this.camera);
      if(Math.abs(this.speed3D - 0.3) > 0.01)
      this.speed3D = 0.99*this.speed3D + 0.003

      this.delta = this.delta % this.interval;
    }

  } 

  public fragmentShader = `
    varying vec3 vPos;
    uniform vec3 size;
    uniform float thickness;
    uniform float smoothness;
    uniform vec3 color;
    vec3 c2 = ${this.dark_theme ? "vec3(0.067)" : "vec3(0.925,0.909,0.937)"};
  
    void main() {
      
      float a = smoothstep(thickness, thickness + smoothness, length(abs(vPos.xy) - size.xy));
      a *= smoothstep(thickness, thickness + smoothness, length(abs(vPos.yz) - size.yz));
      a *= smoothstep(thickness, thickness + smoothness, length(abs(vPos.xz) - size.xz));
      
      vec3 c = mix(color, c2, a);
      
      gl_FragColor = vec4(c, 1.0);
    }
  `

  public vertexShader = `
    varying vec3 vPos;
    void main()	{
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `

  drag3D($event:MouseEvent) {
    if(this.grabbed3D) {
      if(!this.oldMousePos) {
        this.oldMousePos = {y :$event.clientY, time:$event.timeStamp}
      } else {
        this.speed3D = ($event.clientY - this.oldMousePos.y) / ($event.timeStamp - this.oldMousePos.time)
      }
    }
  }
}
