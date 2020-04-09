/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
	Actor,
	AnimationEaseCurves,
	AnimationKeyframe,
	AnimationWrapMode,
	ButtonBehavior,
	Collider,
	ColliderGeometry,
	CollisionLayer,
	Context,
	DegreesToRadians,
	Quaternion,
	TextAnchorLocation,
	User,
	Vector3
} from '@microsoft/mixed-reality-extension-sdk';
import * as MRE from '@microsoft/mixed-reality-extension-sdk';

export default class HelloWorld {
	constructor(private context: Context, private baseUrl: string) {
		this.context.onUserJoined((user) => this.userJoined(user));
		this.context.onStarted(() => this.started());
	}

	// Create list to keep track of items attached to users.
	private attachedItems: {[id: string]: Actor} = {};

	private userJoined(user: User) {
		// Code to run when a user joins.
		console.log(`User joined: ${user.name}`);

		// If attached item for user exists, destroy it and remove from list.
		if (this.attachedItems[user.id]) {
			this.attachedItems[user.id].destroy();
			delete this.attachedItems[user.id];
		}
	}

	private started() {
		// Create cube.
		const mirror = Actor.CreateFromLibrary(this.context, {
			resourceId: "artifact: 1268209511420658610",
			actor: {
				name: 'Mirror',
				transform: {local: {
					position: { x: 0, y: 0, z: 0 },
					scale: { x: 0.5, y: 0.5, z: 0.5}
				}}
			}
		});

		// Create button behavior for cube.
		mirror.setBehavior(ButtonBehavior).onButton("pressed", (user: User) => {
			if (!this.attachedItems[user.id]) {
				// If item for user does not exist, create it and add to list.
				this.attachedItems[user.id] = Actor.CreateFromLibrary(this.context, {
					resourceId: "artifact: 1447256251690910303",
					actor: {
						name: 'Invert',
						attachment: {
							userId: user.id,
							attachPoint: 'spine-top'
						},
						transform: {local: {
							position: { x: 0, y: 0, z: 0.16},
							scale: { x: 26, y: 26, z: 26},
						}}
					}
				});
			} else {
				// If item already exists, destroy it and delete from list.
				this.attachedItems[user.id].destroy();
				delete this.attachedItems[user.id];
			}
		});
	}
}
