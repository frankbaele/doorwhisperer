module.exports = function(){

    var ParticleSystemIDs = Object.freeze(
        {
            Smoke1: 1,
            Smoke2: 2,
            Flame: 3,
            FlameEmbers: 4
        } );

    var ParticleEnvironmentIDs = Object.freeze(
        {
            Campfire: 1
        } );

    var rendererContainer;
    var screenWidth, screenHeight;
    var pointLight, ambientLight;
    var particleSystems, loadingManager;
    var scene, camera, renderer, controls, stats, clock;
    var currentEnvironmentID;
    var smokeActive, smokeType;
    var particleSystemsParent;


    window.addEventListener( "load", function load( event ) {

        window.removeEventListener( "load", load, false );
        init();

    }, false );


    function init() {

        clock = new THREE.Clock();

        getScreenDimensions();

        initScene();
        initGUI();
        initListeners();

        initLights();
        PHOTONS.Util.initializeLoadingManager();
        initSceneGeometry( function() {

            initParticleSystems();
            startParticleSystemEnvironment ( ParticleEnvironmentIDs.Campfire );
            initRenderer();
            initControls();
            initStats();
            animate();

        } );

    }

    function initParticleSystems() {

        particleSystems = {};
        initializeFlameSystem();
        initializeSmokeSystem();

    }

    function initializeSmokeSystem() {

        var _TPSV = PHOTONS.SingularVector;

        smokeType = ParticleSystemIDs.Smoke1;

        var textureLoader = new THREE.TextureLoader();

        var smoke1Atlas = new PHOTONS.Atlas( textureLoader.load( 'textures/campfire/smokeparticle.png' ), true );
        var smoke2Atlas = PHOTONS.Atlas.createGridAtlas( textureLoader.load( 'textures/campfire/smokeparticles.png' ), 0.0, 1.0, 1.0, 0.0, 4.0, 4.0, false, true );

        var altVertexShader = [

            PHOTONS.ParticleSystem.Shader.VertexVars,
            "varying vec4 vPosition;",

            PHOTONS.ParticleSystem.Shader.ParticleVertexQuadPositionFunction,

            "void main()",
            "{",
            "vColor = customColor;",
            "vUV = uv;",
            "vec4 quadPos = getQuadPosition();",
            "vPosition = viewMatrix * quadPos;",
            "gl_Position = projectionMatrix * vPosition;",
            "}"

        ].join( "\n" );

        var altFragmentShader = [

            PHOTONS.ParticleSystem.Shader.FragmentVars,
            "varying vec4 vPosition;",

            THREE.ShaderChunk[ "common" ],
            THREE.ShaderChunk[ "bsdfs" ],
            THREE.ShaderChunk[ "lights_pars" ],

            "void main()",
            "{",

            "vec4 textureColor = texture2D( texture, vUV );",
            "vec4 viewPosition = -vPosition;",
            "vec3 outgoingLight = vec3( 0.0 );",
            "vec4 diffuseColor = vColor * textureColor;",

            "vec3 totalDiffuseLight = vec3( 0.0 );",

            "#if NUM_POINT_LIGHTS > 0",
            "for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {",
            "vec3 lightColor = pointLights[ i ].color;",
            "vec3 lightPosition = pointLights[ i ].position;",
            "vec3 lVector = lightPosition + viewPosition.xyz;",
            "vec3 lightDir = normalize( lVector );",
            "float attenuation = punctualLightIntensityToIrradianceFactor( length( lVector ), pointLights[ i ].distance, pointLights[ i ].decay );",
            "totalDiffuseLight += lightColor * attenuation;",
            "}",
            "#endif",

            "gl_FragColor = diffuseColor * vec4( totalDiffuseLight, 1.0 );",
            "}"

        ].join( "\n" );

        var customUniforms1 = THREE.UniformsUtils.merge( [ THREE.UniformsLib[ 'lights' ], THREE.UniformsLib[ 'ambient' ] ] );

        var altMaterial1 = PHOTONS.ParticleSystem.createMaterial( altVertexShader, altFragmentShader, customUniforms1 );
        altMaterial1.lights = true;
        altMaterial1.blending = THREE.CustomBlending;
        altMaterial1.blendSrc = THREE.SrcAlphaFactor;
        altMaterial1.blendDst = THREE.OneMinusSrcAlphaFactor;
        altMaterial1.blendEquation = THREE.AddEquation;
        altMaterial1.uniforms.texture.value = smoke1Atlas.getTexture();

        var altMaterial2 = altMaterial1.clone();
        altMaterial2.uniforms.texture.value = smoke2Atlas.getTexture();

        var particleSystemParams1 = {

            material: altMaterial1,
            zSort: true,
            particleAtlas : smoke1Atlas,
            particleReleaseRate : 100,
            particleLifeSpan : 3.0,
            lifespan : 0

        };

        var particleSystemParams2 = {

            material: altMaterial2,
            zSort: true,
            particleAtlas : smoke2Atlas,
            particleReleaseRate : 100,
            particleLifeSpan : 3.0,
            lifespan : 0

        };

        var particleSystem1 = new PHOTONS.ParticleSystem();
        particleSystem1.initialize( camera, scene, particleSystemParams1 );

        var particleSystem2 = new PHOTONS.ParticleSystem();
        particleSystem2.initialize( camera, scene, particleSystemParams2 );

        var positionModifier = new PHOTONS.RandomModifier(
            {
                offset: new THREE.Vector3( 0, 0, 0 ),
                range: new THREE.Vector3( 10, 0, 10 ),
                rangeEdgeClamp: false,
                rangeType: PHOTONS.RangeType.Sphere
            } );

        var velocityModifier = new PHOTONS.RandomModifier(
            {
                offset: new THREE.Vector3( 0, 75, 0 ),
                range: new THREE.Vector3( 5, 30, 5 ),
                rangeEdgeClamp: false,
                rangeType: PHOTONS.RangeType.Sphere
            } );

        var accelerationModifier = new PHOTONS.RandomModifier(
            {
                offset: new THREE.Vector3( 0, - 22, 0 ),
                range: new THREE.Vector3( 35, 20, 35 ),
                rangeEdgeClamp: false,
                rangeType: PHOTONS.RangeType.Cube
            } );

        var rotationModifier = new PHOTONS.RandomModifier(
            {
                offset: new PHOTONS.SingularVector( 0 ),
                range: new PHOTONS.SingularVector( 360 )
            } );

        var rotationalSpeedModifier = new PHOTONS.RandomModifier(
            {
                offset: new PHOTONS.SingularVector( 50 ),
                range: new PHOTONS.SingularVector( 400 )
            } );

        var atlas1Modifier = new PHOTONS.EvenIntervalIndexModifier ( 1 );

        var sizeModifier = new PHOTONS.FrameSetModifier(
            new PHOTONS.FrameSet(
                [ 0, 3 ],
                [ new THREE.Vector2( 10, 10 ),
                    new THREE.Vector2( 40, 40 ) ],
                false )
        );

        var alphaModifier = new PHOTONS.FrameSetModifier(
            new PHOTONS.FrameSet(
                [ 0, 1.0, 2.0, 3.0 ],
                [ new _TPSV( 0.0 ), new _TPSV( 0.1 ), new _TPSV( 0.075 ), new _TPSV( 0.0 ) ],
                true
            ) );

        var colorModifier = new PHOTONS.FrameSetModifier(
            new PHOTONS.FrameSet(
                [ 0.0, 1.5, 3 ],
                [ new THREE.Vector3( 0.1, 0.1, 0.1 ),
                    new THREE.Vector3( 0.35, 0.35, 0.35 ),
                    new THREE.Vector3( 0.7, 0.7, 0.7 ) ],
                false )
        );

        particleSystem1.bindInitializer( 'position', positionModifier );
        particleSystem1.bindInitializer( 'velocity', velocityModifier );
        particleSystem1.bindInitializer( 'acceleration', accelerationModifier );
        particleSystem1.bindInitializer( 'rotation', rotationModifier );
        particleSystem1.bindInitializer( 'rotationalSpeed', rotationalSpeedModifier );
        particleSystem1.bindModifier( 'atlas', atlas1Modifier );
        particleSystem1.bindModifier( 'size', sizeModifier );
        particleSystem1.bindModifier( 'alpha', alphaModifier );
        particleSystem1.bindModifier( 'color', colorModifier );

        var atlas2Modifier = new PHOTONS.EvenIntervalIndexModifier ( 16 );

        particleSystem2.bindInitializer( 'position', positionModifier );
        particleSystem2.bindInitializer( 'velocity', velocityModifier );
        particleSystem2.bindInitializer( 'acceleration', accelerationModifier );
        particleSystem2.bindInitializer( 'rotation', rotationModifier );
        particleSystem2.bindInitializer( 'rotationalSpeed', rotationalSpeedModifier );
        particleSystem2.bindModifier( 'atlas', atlas2Modifier );
        particleSystem2.bindModifier( 'size', sizeModifier );
        particleSystem2.bindModifier( 'alpha', alphaModifier );
        particleSystem2.bindModifier( 'color', colorModifier );

        particleSystems[ ParticleSystemIDs.Smoke1 ] = particleSystem1;
        particleSystems[ ParticleSystemIDs.Smoke2 ] = particleSystem2;

        particleSystemsParent.add ( particleSystems[ ParticleSystemIDs.Smoke1 ] );
        particleSystemsParent.add ( particleSystems[ ParticleSystemIDs.Smoke2 ] );

    }

    function initializeFlameSystem() {

        var _TPSV = PHOTONS.SingularVector;

        // ---------------------
        // flame particle system
        // ---------------------

        var flameMaterial = PHOTONS.ParticleSystem.createMaterial();
        flameMaterial.blending = THREE.AdditiveBlending;

        var particleSystemParams = {

            material: flameMaterial,
            particleAtlas : PHOTONS.Atlas.createGridAtlas( new THREE.TextureLoader().load( 'textures/campfire/fireloop3.jpg' ), 0.0, 1.0, 1.0, 0.0, 8.0, 8.0, false, true ),
            particleReleaseRate : 3,
            particleLifeSpan : 3,
            lifespan : 0

        };
        var particleSystem = new PHOTONS.ParticleSystem();
        particleSystem.initialize( camera, scene, particleSystemParams );

        particleSystem.bindModifier( "atlas", new PHOTONS.EvenIntervalIndexModifier ( 64 ) );

        particleSystem.bindModifier( "size", new PHOTONS.FrameSetModifier(
            new PHOTONS.FrameSet(
                [ 0, 3 ],
                [ new THREE.Vector3( 20, 25 ),
                    new THREE.Vector3( 20, 25 ) ],
                false )
        ) );

        particleSystem.bindModifier( "alpha", new PHOTONS.FrameSetModifier(
            new PHOTONS.FrameSet(
                [ 0, 0.2, 1.2, 2.0, 3 ],
                [ new _TPSV( 0 ), new _TPSV( .3 ), new _TPSV( 1 ), new _TPSV( 1 ), new _TPSV( 0 ) ],
                true )
        ) );

        particleSystem.bindModifier( "color", new PHOTONS.FrameSetModifier(
            new PHOTONS.FrameSet(
                [ 0, 3 ],
                [ new THREE.Vector3( 1.4, 1.4, 1.4 ),
                    new THREE.Vector3( 1.4, 1.4, 1.4 ) ],
                false )
        ) );

        particleSystem.bindInitializer( 'position', new PHOTONS.RandomModifier(
            {
                offset: new THREE.Vector3( 0, 0, 0 ),
                range: new THREE.Vector3( 0, 0, 0 ),
                rangeEdgeClamp: false,
                rangeType: PHOTONS.RangeType.Sphere
            } ) );

        particleSystem.bindInitializer( 'velocity', new PHOTONS.RandomModifier(
            {
                offset: new THREE.Vector3( 0, 25, 0 ),
                range: new THREE.Vector3( 10, 2, 10 ),
                rangeEdgeClamp: false,
                rangeType: PHOTONS.RangeType.Sphere
            } ) );

        particleSystems[ ParticleSystemIDs.Flame ] = particleSystem;
        particleSystemsParent.add ( particleSystems[ ParticleSystemIDs.Flame ] );


        // ---------------------
        // flame embers particle system
        // ---------------------

        var emberMaterial = PHOTONS.ParticleSystem.createMaterial();
        emberMaterial.blending = THREE.AdditiveBlending;

        particleSystemParams = {

            material: emberMaterial,
            particleAtlas : new PHOTONS.Atlas( new THREE.TextureLoader().load( 'textures/campfire/Puff.png' ), true ),
            particleReleaseRate : 18,
            particleLifeSpan : 3,
            lifespan : 0

        };
        particleSystem = new PHOTONS.ParticleSystem();
        particleSystem.initialize( camera, scene, particleSystemParams );

        particleSystem.bindModifier( "atlas", new PHOTONS.EvenIntervalIndexModifier ( 1 ) );

        particleSystem.bindModifier( 'size', new PHOTONS.RandomModifier(
            {
                offset: new THREE.Vector3( .25, .25, 0.0 ),
                range: new THREE.Vector3( 0.05, 0.05, 0.0 ),
                rangeEdgeClamp: false,
                rangeType: PHOTONS.RangeType.Sphere,
                runOnce: true
            } ) );

        particleSystem.bindModifier( "alpha", new PHOTONS.FrameSetModifier(
            new PHOTONS.FrameSet(
                [ 0, 0.2, 1.2, 2.0, 3 ],
                [ new _TPSV( 0 ), new _TPSV( 1 ), new _TPSV( 1 ), new _TPSV( 1 ), new _TPSV( 0 ) ],
                true )
        ) );

        particleSystem.bindModifier( "color", new PHOTONS.FrameSetModifier(
            new PHOTONS.FrameSet(
                [ 0, 2, 3 ],
                [ new THREE.Vector3( 1.3, 1.3, 0 ),
                    new THREE.Vector3( .75, .4, .4 ),
                    new THREE.Vector3( .6, .6, .6 ) ],
                false )
        ) );

        particleSystem.bindInitializer( 'position', new PHOTONS.RandomModifier(
            {
                offset: new THREE.Vector3( 0, 7, 0 ),
                range: new THREE.Vector3( 3, 0, 3 ),
                rangeEdgeClamp: false,
                rangeType: PHOTONS.RangeType.Sphere
            } ) );

        particleSystem.bindInitializer( 'velocity', new PHOTONS.RandomModifier(
            {
                offset: new THREE.Vector3( 0, 25, 0 ),
                range: new THREE.Vector3( 15, 25, 15 ),
                rangeEdgeClamp: true,
                rangeType: PHOTONS.RangeType.Sphere
            } ) );

        particleSystem.bindModifier( 'acceleration', new PHOTONS.RandomModifier(
            {
                offset: new THREE.Vector3( 0, 15, 0 ),
                range: new THREE.Vector3( 180, 280, 180 ),
                rangeEdgeClamp: true,
                rangeType: PHOTONS.RangeType.Sphere
            } ) );

        particleSystems[ ParticleSystemIDs.FlameEmbers ] = particleSystem;
        particleSystemsParent.add( particleSystems[ ParticleSystemIDs.FlameEmbers ] );

    }

    function initSceneGeometry( onFinished ) {

        particleSystemsParent = new THREE.Object3D();
        particleSystemsParent.position.set( 0, 0, 0 );
        particleSystemsParent.matrixAutoUpdate = true;
        scene.add( particleSystemsParent );
    }

    function initControls() {

        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0, 0 );
        controls.update();

    }

    var flickerPointLight = ( function() {
        var lastAdjuster;
        return function flickerPointLight() {
            var adjuster = ( Math.random() - 0.5 );
            if ( lastAdjuster ) {

                diff = ( adjuster - lastAdjuster ) * .2;
                adjuster = lastAdjuster + diff;

            }
            var intensity = 4;
            intensity += adjuster * 4;
            pointLight.intensity = intensity;
            pointLight.distance = adjuster * 50 + 200;
            pointLight.decay = adjuster * 5 + 3;
            lastAdjuster = adjuster;
        }
    } )();

    function startParticleSystemEnvironment( id ) {

        Object.keys( particleSystems ).forEach( function( key ) {

            var system = particleSystems[ key ];
            system.deactivate();

        } );

        currentEnvironmentID = id;
        if ( id == ParticleEnvironmentIDs.Campfire ) {

            smokeActive = true;
            particleSystems[ ParticleSystemIDs.Flame ].activate();
            particleSystems[ ParticleSystemIDs.FlameEmbers ].activate();
            updateSmokeType();
            pointLight.distance = 300;
            pointLight.intensity = 6;
            pointLight.color.setRGB( 1, .8, .4 );
            pointLight.decay = 2;
            pointLight.position.set( 0, 40, 0 );

            ambientLight.color.setRGB( .08, .08, .08 );

        } else {

            return;

        }

    }


    function updateParticleSystems() {

        var deltaTime = clock.getDelta();

        Object.keys( particleSystems ).forEach( function( key ) {

            var system = particleSystems[ key ];
            if ( system.isActive ) {

                system.update( deltaTime );

            }

        } );

        if ( currentEnvironmentID == ParticleEnvironmentIDs.Campfire ) {

            flickerPointLight();

        }

    }

    function animate() {

        requestAnimationFrame( animate );
        update();
        render();

    }

    function update() {

        var time = performance.now() * 0.001;

        //particleSystemsParent.position.x = Math.sin( time ) * 49;
        //particleSystemsParent.position.z = Math.sin( time * 1.2 ) * 49;

        controls.update();
        stats.update();
        updateParticleSystems();

    }
}