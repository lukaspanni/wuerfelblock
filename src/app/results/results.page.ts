import { Component, OnInit } from '@angular/core';
import { PersistenceService } from '../services/persistence/persistence.service';
export const resultsStorageKey = 'Results';

export type GameResult = {
  date: Date;
  points: ResultEntry[];
};

export type ResultEntry = {
  player: string;
  points: number;
};

@Component({
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss']
})
export class ResultsPage implements OnInit {
  public storedResults: GameResult[] = [];

  constructor(private persistenceService: PersistenceService) {}

  public async ngOnInit(): Promise<void> {
    this.loadStoredResults();
  }

  public async loadStoredResults(): Promise<void> {
    const resultPromises = (await this.persistenceService.keys())
      .filter((key) => key.startsWith(resultsStorageKey))
      .map((key) => this.persistenceService.retrieve(key));
    const results = await Promise.all(resultPromises);
    results.forEach((result) => this.storedResults.push(JSON.parse(result)));
  }
}
