nebula
======

A game about bases and minions and balls and chains.
Codename totally not related to the game


# SPEC

## Description for one player

The Player starts with a Base and a Hero. The Base is capable of spawning
Minions, which make damage to emeny Minions, enemy Heroes and enemy Bases.

The Base spawns minions at a slow rate, and the Hero can take control of the
Base to spawn minions. When mounted in the Base, the Hero cannot move, but can
control the angle in which the minions will spawn. There is an action to mount
and dismount the Hero from the base.

The minions by default will travel in the direction they were spawned, around
the Base.

The Hero has a Weapon. The Weapon has two actions: charge and release. Charge
will grab minions from the environment (in a radius or bounding box defined by
the Weapon), and the number of minions grabbed will determine the strength of
the attack, with a fixed limit, which will release the max possible damage
attack). The hero can stop charging anytime and move around or perform the
attack.

The Base has a life meter, represented in game as a shied. When the Hero is in
the Base, the shield slowly recovers.

The Player loses when either the Base or the Hero die.

### Weapons

- Ball and chain
    - Charge: A ball and chain swings around the player, and will grab any
              minion caught in the ball hitbox
    - Release: The ball and chain will release a powerful attack in the
               direction the Hero is facing

## Technical spec

