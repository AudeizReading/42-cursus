/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
	/**
	 * Select tests for shard requested via --shard=shardIndex/shardCount
	 * Sharding is applied before sorting
	 */
	shard(tests, { shardIndex, shardCount }) {
		const shardSize = Math.ceil(tests.length / shardCount);
		const shardStart = shardSize * (shardIndex - 1);
		const shardEnd = shardSize * shardIndex;

		return [...tests].sort((a, b) => (a.path > b.path ? 1 : -1)).slice(shardStart, shardEnd);
	}

	/**
	 * Sort test to determine order of execution
	 * Sorting is applied after sharding
	 */
	sort(tests) {
		// Test structure information
		// https://github.com/jestjs/jest/blob/6b8b1404a1d9254e7d5d90a8934087a9c9899dab/packages/jest-runner/src/types.ts#L17-L21

		const copyTests = [...tests];
		copyTests.sort((testA, testB) => {
			if (testA.path.includes(`src/infra/leaderboard/leaderBoardService.spec.ts`)) {
				return -1; // Move the specified file to the beginning
			} else if (testB.path.includes(`src/infra/leaderboard/leaderBoardService.spec.ts`)) {
				return 1; // Move the specified file to the beginning
			} else {
				return testA.path.localeCompare(testB.path); // Sort the rest of the files alphabetically
			}
		});
		return copyTests;
	}
}

module.exports = CustomSequencer;
