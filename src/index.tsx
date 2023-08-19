export function putInPos(arr: any[], stuff: any, pos: number) {
  return [...arr.slice(0, pos), stuff, ...arr.slice(pos, arr.length)];
}

import { create } from 'zustand';
import { Platform } from 'react-native';

//!Não apagar comentarios
interface EnqueuedModalData {
  setActive: (newValue: boolean) => void;
}
interface userModalQueueStoreData {
  isFree: boolean;
  queue: EnqueuedModalData[];
  free: () => void;
  wait: (amount: number) => void;
  addToQueue: (setActive: (newValue: boolean) => void) => void;
  showModal: () => void;
  cleanQueue: () => void;
}

const delay = 500;
export const userModalQueueStore = create<userModalQueueStoreData>()((set) => ({
  isFree: true,
  queue: [],
  free: () => {
    function action() {
      set((val) => {
        for (const valor of val.queue) {
          valor.setActive(false);
        }

        return {};
      });
      set((val) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [first, ...rest] = val.queue;
        return { queue: rest };
      });
      set(() => ({ isFree: true }));
      set((val) => {
        val.showModal();
        return {};
      });
    }

    if (Platform.OS === 'ios') {
      setTimeout(() => {
        action();
      }, delay);
    } else {
      action();
    }
    // setTimeout(() => {

    // log
    // set(vals => {
    // 	console.log('free queue:', vals.queue);
    // 	console.log('free isFree:', vals.isFree);
    // 	return {};
    // });
    // }, delay);
  },
  wait: (amount: number) => {
    function action() {
      let firstElement: EnqueuedModalData | null = null;

      set((val) => {
        for (const valor of val.queue) {
          valor.setActive(false);
        }
        return {};
      });
      set((val) => {
        const [first, ...rest] = val.queue;
        firstElement = first;
        return { queue: rest };
      });

      if (firstElement === null) {
        return;
      }
      set((val) => {
        return {
          queue: putInPos(val.queue, firstElement, amount),
        };
      });
      set(() => ({ isFree: true }));
      set((val) => {
        val.showModal();
        return {};
      });
    }
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        action();
      }, delay);
    } else {
      action();
    }

    // log
    // set(vals => {
    // 	console.log('wait queue', vals.queue);
    // 	console.log('wait isFree:', vals.isFree);
    // 	return {};
    // });
    // }, delay);
  },
  addToQueue: (setActive: (newValue: boolean) => void) => {
    set((vals) => {
      return { queue: [...vals.queue, { setActive: setActive }] };
    });
    set((vals) => {
      vals.showModal();

      return {};
    });
    // log
    // set(vals => {
    // 	console.log('addToQueue queue', vals.queue);
    // 	console.log('addToQueue isFree:', vals.isFree);
    // 	return {};
    // });
  },
  showModal: () => {
    function action() {
      set((vals) => {
        if (vals.queue.length > 0 && vals.isFree) {
          vals.queue[0].setActive(true);

          // console.log('Show modal abriu:', vals.queue);
          return { isFree: false };
        }
        // console.log('Show modal nao abriu:', vals.queue);
        return {};
      });
    }
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        action();
      }, delay);
    } else {
      action();
    }
  },

  cleanQueue: () => {
    set((val) => {
      for (const valor of val.queue) {
        valor.setActive(false);
      }
      return {};
    });
    set({ queue: [], isFree: true });
  },
}));
