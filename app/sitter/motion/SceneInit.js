import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

export function initScene(callback) {
  const scene = new THREE.Scene()

  scene.background = new THREE.Color('#ffe4dd') // 柔和米色
  scene.add(new THREE.HemisphereLight(0xffeebb, 0x080820, 1))

  // scene.add(new THREE.AmbientLight(0x777777))

  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(100, 100, 100)
  scene.add(light)

  const labeldata = [
    { size: 0.01, scale: 0.0001, label: '吉娃娃 — 我們最小的朋友' },
    { size: 0.01, scale: 0.1, label: '博美犬 — 蓬鬆小可愛' },
    { size: 0.01, scale: 1.0, label: '約克夏 — 小身材大能量' },
    { size: 1, scale: 1.0, label: '柴犬 — 自信的探險家' },
    { size: 10, scale: 1.0, label: '黃金獵犬 — 忠誠與愛的化身' },
    { size: 100, scale: 1.0, label: '聖伯納犬 — 溫柔的巨人' },
    { size: 1000, scale: 1.0, label: '大丹犬 — 威嚴的守護者' },
    { size: 10000, scale: 1.0, label: '柯基星雲 — 可愛滿天' },
    { size: 3400000, scale: 1.0, label: '狗狗之月 — 躍向夢想' },
    { size: 12000000, scale: 1.0, label: '汪星球 — 毛孩的星球' },
    { size: 1.4e9, scale: 1.0, label: '陽光小徑 — 喜悅的能量' },
    { size: 7.47e12, scale: 1.0, label: '寵物平台 — 攜手同行' },
    { size: 9.46e15, scale: 1.0, label: '狗狗城市 — 為毛孩打造的世界' },
    {
      size: 3.08e16,
      scale: 1.0,
      label: 'Bark & Bijou 世界 — 所有尾巴搖擺的地方',
    },
    { size: 1e19, scale: 1.0, label: 'Bark & Bijou' },
  ]

  const loader = new FontLoader()
  loader.load('/fonts/Noto Sans TC_Regular.json', (font) => {
    const dotGeometry = new THREE.SphereGeometry(0.5, 24, 12)

    labeldata.forEach((data) => {
      const scale = data.scale
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
      })

      const textGeo = new TextGeometry(data.label, {
        font,
        size: data.size,
        depth: data.size / 2,
      })
      textGeo.computeBoundingSphere()
      textGeo.translate(-textGeo.boundingSphere.radius, 0, 0)

      const group = new THREE.Group()
      group.position.z = -data.size * scale
      scene.add(group)

      const textMesh = new THREE.Mesh(textGeo, material)
      textMesh.scale.set(scale, scale, scale)
      textMesh.position.z = -data.size * scale
      textMesh.position.y = (data.size / 4) * scale
      group.add(textMesh)

      const dotMesh = new THREE.Mesh(dotGeometry, material)
      dotMesh.position.y = (-data.size / 4) * scale
      dotMesh.scale.multiplyScalar(data.size * scale)
      group.add(dotMesh)
    })

    callback(scene)
  })
}
