/**
 * Enumeration representing the possible shapes a spirit can take.
 */
enum Shape {
	Circles = 'circles',
	Squares = 'squares',
	Triangles = 'triangles'
}

/**
 * Global memory object for storing persistent data across ticks.
 */
declare const memory: Record<string, any>;

/**
 * The player's main base structures. Each base has energy capacity and controls the area around it.
 */
declare const base_zxq: Structure;
declare const base_a2c: Structure;
declare const base_p89: Structure;
declare const base_nua: Structure;

/**
 * Stars that regenerate energy over time. Control of stars can provide strategic advantages.
 */
declare const star_zxq: Star;
declare const star_a2c: Star;
declare const star_p89: Star;
declare const star_nua: Star;

/**
 * Outposts extend control and can attack enemies within their range.
 */
declare const outpost_mdo: Outpost;
declare const outpost: Outpost;

/**
 * Pylons connect different structures, expanding control and facilitating energy transfer.
 */
declare const pylon_u3p: Pylon;
declare const pylon: Pylon;

/**
 * Array of spirits controlled by the player.
 */
declare const my_spirits: Spirit[];

/**
 * All spirits in the game, indexed by their unique IDs.
 */
declare const spirits: Record<string, Spirit>;

/**
 * Current game tick, indicating the number of frames since the game started.
 */
declare const tick: number;

export type Target = Spirit | Structure;
export type Coordinates = [number, number];

/**
 * Represents a spirit in the game, with various properties and actions it can perform.
 */
interface Spirit {
	id: string; // Unique identifier for the spirit.
	position: Coordinates; // Current position of the spirit on the map.
	size: number; // Size of the spirit, affecting its energy capacity and abilities.
	energy_capacity: number; // Maximum energy the spirit can store.
	energy: number; // Current energy stored in the spirit.
	hp: number; // Hit points of the spirit, determining its durability.
	mark: string; // A custom mark or label for organizational purposes.
	last_energized: string; // The ID of the last target energized by this spirit.
	shape: Shape; // The shape of the spirit, determining its abilities and roles.
	player_id: string; // The ID of the player controlling this spirit.
	sight: Sight; // The field of view of the spirit, detecting nearby friends, enemies, and structures.

	/**
	 * Transfers energy to the specified target if within range.
	 * @param target The target to energize, which can be a Spirit or a Structure.
	 */
	energize(target: Target): void;

	/**
	 * Moves the spirit to the specified coordinates.
	 * @param target The coordinates to move the spirit to.
	 */
	move(target: Coordinates): void;

	/**
	 * Instantly jumps the spirit to the specified coordinates.
	 * @param target The coordinates to jump the spirit to.
	 */
	jump(target: Coordinates): void;

	/**
	 * Merges this spirit with another, combining their energy and properties.
	 * @param target The spirit to merge with.
	 */
	merge(target: Spirit): void;

	/**
	 * Divides the spirit into two smaller spirits.
	 */
	divide(): void;

	/**
	 * Locks the spirit, preventing it from moving or acting until unlocked.
	 */
	lock(): void;

	/**
	 * Unlocks the spirit, allowing it to move and act again.
	 */
	unlock(): void;

	/**
	 * Destroys the spirit in a burst of energy, affecting nearby units.
	 */
	explode(): void;

	/**
	 * Sends a message to all other spirits, useful for coordination.
	 * @param message The message to shout.
	 */
	shout(message: string): void;

	/**
	 * Sets a custom mark or label on the spirit.
	 * @param label The label to set on the spirit.
	 */
	set_mark(label: string): void;
}

/**
 * Specialized spirit types with specific omitted abilities, based on their shape.
 */
export type CircleSpirit = Omit<Spirit, 'lock' | 'unlock' | 'explode'>;
export type SquareSpirit = Omit<Spirit, 'merge' | 'divide' | 'explode'>;
export type TriangleSpirit = Omit<Spirit, 'merge' | 'divide' | 'lock' | 'unlock'>;

/**
 * Represents a structure in the game, such as a base, outpost, pylon, or star.
 */
interface Structure {
	id: string; // Unique identifier for the structure.
	structure_type: string; // Type of structure (base, outpost, pylon, star).
	position: Coordinates; // Current position of the structure on the map.
	energy_capacity: number; // Maximum energy the structure can store.
	energy: number; // Current energy stored in the structure.
	control: string; // ID of the controlling player or spirit.
	sight: Sight; // The field of view of the structure, detecting nearby friends, enemies, and structures.
}

/**
 * Stars are the source of energy. Every tick (1 tick = 500ms), a star generates 2 energy + 2% of its current energy (rounded to a nearest integer). Except for star_nua that generates 3 energy + 3%.
 */
interface Star extends Omit<Structure, 'sight'> {
	regeneration: number; // Rate at which the star regenerates energy over time.
}

/**
 * Base is the birthplace for new spirits, automatically generating new spirits when it has enough energy.
 * If there is an enemy in its sight, the base stops producing new spirits, keeping all energy to defend itself.
 */
interface Base extends Structure {
	current_spirit_cost: number; // Energy cost per new spirit.
}

/**
 * Neutral structure that provides strategic advantage for whoever controls it by automatically shooting at enemy targets within its range.
 * Outpost deals 2 damage (costing 1 energy, same as a spirit) when it has less than 500 energy and 8 damage (costing 4 energy) when it has over 500 energy.
 */
interface Outpost extends Structure {
	/**
	 * The range within which the outpost can attack enemies or exert control.
	 * 400 (600 if outpost's energy >= 500)
	 */
	range: number;
}

/**
 * Neutral structure that provides strategic advantage for whoever controls it by automatically healing all friendly spirits within its range.
 * Pylon heals all friendly spirits that are inside the annulus area where the smaller circle has radius 200 and the larger one 400 units. The healing rate is 1 energy per tick per spirit.
 */
interface Pylon extends Structure {}

/**
 * Represents the vision field, listing the IDs of visible friends, enemies, and structures.
 */
interface Sight {
	friends: string[]; // IDs of friendly units in sight.
	enemies: string[]; // IDs of enemy units in sight.
	structures: string[]; // IDs of visible structures in sight.
}

/**
 * Constants representing various IDs and types for quick reference and type safety.
 */
const BASE_IDS = ['base_zxq', 'base_a2c', 'base_p89', 'base_nua'] as const;
const STAR_IDS = ['star_zxq', 'star_a2c', 'star_p89', 'star_nua'] as const;
const STRUCTURE_TYPES = ['base', 'outpost', 'pylon', 'star'] as const;
