import { ReputationManager } from './ReputationManager';
import { MempoolManager } from './MempoolManager';
import { TypedEvent } from '../types/common';
import { AccountDeployedEvent, IEntryPoint, SignatureAggregatorChangedEvent, UserOperationEventEvent } from '@account-abstraction/utils';
/**
 * listen to events. trigger ReputationManager's Included
 */
export declare class EventsManager {
    readonly entryPoint: IEntryPoint;
    readonly mempoolManager: MempoolManager;
    readonly reputationManager: ReputationManager;
    lastBlock?: number;
    constructor(entryPoint: IEntryPoint, mempoolManager: MempoolManager, reputationManager: ReputationManager);
    /**
     * automatically listen to all UserOperationEvent events
     */
    initEventListener(): void;
    /**
     * process all new events since last run
     */
    handlePastEvents(): Promise<void>;
    handleEvent(ev: UserOperationEventEvent | AccountDeployedEvent | SignatureAggregatorChangedEvent): void;
    handleAggregatorChangedEvent(ev: SignatureAggregatorChangedEvent): void;
    eventAggregator: string | null;
    eventAggregatorTxHash: string | null;
    getEventAggregator(ev: TypedEvent): string | null;
    handleAccountDeployedEvent(ev: AccountDeployedEvent): void;
    handleUserOperationEvent(ev: UserOperationEventEvent): void;
    _includedAddress(data: string | null): void;
}
