import { Player } from '../shared/types';
import { addPlayer, getPlayer, updatePlayer } from './database';

export const createPlayer = (): Player => {
  const newPlayer: Player = {
    id: Math.random().toString(36).substring(2, 9),
    x: Math.random() * 750,
    y: Math.random() * 550,
    width: 50,
    height: 50,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    speed: 100,
    attack: 80,
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    attackRange: 50,
  };

  addPlayer(newPlayer);
  return newPlayer;
};

export const handlePlayerUpdates = (player: Player): void => {
  const existingPlayer = getPlayer(player.id);
  if (existingPlayer) {
    updatePlayer({ ...existingPlayer, ...player });
  }
};