import * as THREE from 'three'

THREE.ColorManagement.legacyMode = false

export const boxGeometry = new THREE.BoxGeometry(1,1,1)
export const floorMaterial1 = new THREE.MeshStandardMaterial( { color: '#111111', metalness: 0, roughness: 0 } )
export const floorMaterial2 = new THREE.MeshStandardMaterial( { color: '#222222', metalness: 0, roughness: 0 } )
export const obstacleMaterial = new THREE.MeshStandardMaterial( { color: '#ff0000', metalness: 0, roughness: 1 } )
export const wallMaterial = new THREE.MeshStandardMaterial( { color: '#887777', metalness: 0, roughness: 0 } )