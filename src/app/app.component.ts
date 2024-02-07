import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import party from "party-js";
@Component({
	selector: 'app-root',
	standalone: true,
	imports: [CommonModule, RouterOutlet, MatDialogModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
	title = 'tic-tac-toe';
	counter = 1;
	next_player: String = '';
	odd_clicked: string[] = [];
	even_clicked: string[] = [];
	possibilities = [['1_1', '1_2', '1_3'], ['1_1', '2_1', '3_1'], ['1_1', '2_2', '3_3'], ['1_2', '2_2', '3_2'], ['1_3', '2_3', '3_3'], ['1_3', '2_2', '3_1'], ['2_1', '2_2', '2_3'], ['3_1', '3_2', '3_3']];
	winner: string = '';
	player_1: any;
	player_2: any;
	rounds: any;
	player_1_wins = 0;
	player_2_wins = 0;
	current_round = 1;
	draw_matches = 0;
	matched_elements: any;

	constructor(private dialog: MatDialog) { }

	ngOnInit(): void {
		// Open dialog for player info only when there is no data stored in localstorage
		let stored_players = localStorage.getItem('players');
		if (!stored_players) {
			this.openDialog();
		}
		else {
			// Storing necessary data initially
			this.player_1 = JSON.parse(stored_players).player_1;
			this.player_2 = JSON.parse(stored_players).player_2;
			this.next_player = `${this.player_1} (X)`;
			this.rounds = JSON.parse(stored_players).rounds;
		}
	}

	openDialog() {
		let player_info = {
			player_1: this.player_1 ?? '',
			player_2: this.player_2 ?? '',
		};

		this.dialog.open(DialogComponent, {
			disableClose: true,
			width: '30%',
			data: { id: 'player_info', player_info: player_info }
		}).afterClosed().subscribe(data => {
			this.player_1 = data['player_1'];
			this.player_2 = data['player_2'];
			this.rounds = data['rounds'];
			this.next_player = `${this.player_1} (X)`;

			let players = {
				player_1: this.player_1,
				player_2: this.player_2,
				rounds: this.rounds
			}
			localStorage.setItem('players', JSON.stringify(players))
		})
	}

	play(row: any, col: any) {
		console.log(row + '_' + col)
		const element = document.getElementById(row + '_' + col);
		const is_even = this.counter % 2 === 0;

		if (element) {
			// Check if the element already has a value assigned
			// If it's already filled, preventing filling it again

			if (element.innerText === '') {

				// Setting element value
				element.innerText = is_even ? 'O' : 'X';

				// Setting next player
				this.next_player = is_even ? `${this.player_1} (X)` : `${this.player_2} (O)`;

				if (is_even) {
					this.even_clicked.push(row + '_' + col);
					document.getElementById(row + '_' + col)?.classList.add('even_color');

					if (this.even_clicked.length >= 3) {
						let even_satisfy = this.possibilities.some((possibility) => {
							this.matched_elements = this.even_clicked.filter(element => possibility.includes(element));
							return this.matched_elements.length >= 3;
						});

						// If condition satisfies, declaring winner and resetting board
						if (even_satisfy) {
							this.winningConditionSatisfy('even', this.matched_elements);
						}
					}
				} else {
					this.odd_clicked.push(row + '_' + col);
					document.getElementById(row + '_' + col)?.classList.add('odd_color');

					if (this.odd_clicked.length >= 3) {
						let odd_satisfy = this.possibilities.some((possibility) => {
							this.matched_elements = this.odd_clicked.filter(element => possibility.includes(element));
							return this.matched_elements.length >= 3;
						});

						// If condition satisfies, declaring winner and resetting board
						if (odd_satisfy) {
							this.winningConditionSatisfy('odd', this.matched_elements);
						}
					}
				}

				// Updaing counter by 1 on every click
				this.counter++;

				if (this.counter === 10) {
					this.winner = 'none';
					this.draw_matches++;

					this.resettingAfterRound();
				}
			}
		}
	}

	winningConditionSatisfy(value: any, matched_elements: any) {
		if (value === 'even') {
			this.winner = this.player_2;
			this.player_2_wins++;
		} else if (value === 'odd') {
			this.winner = this.player_1;
			this.player_1_wins++;
		}
		this.confetti();
		this.resettingAfterRound();
		return;
	}

	resettingAfterRound() {
		if (this.current_round !== this.rounds) {
			setTimeout(() => {
				this.reset();
				this.current_round++;
			}, 3000);
		}
	}

	toggleClasses(value: any) {
		let strip_hrz = document.getElementById('strip_hrz');
		let strip_vrt = document.getElementById('strip_vrt');
		let strip_cross = document.getElementById('strip_cross');
		let el_to_disable = ['1_1', '1_2', '1_3', '2_1', '2_2', '2_3', '3_1', '3_2', '3_3'];

		el_to_disable.forEach((el: any) => {
			let element = document.getElementById(el)
			if (value === 'disable') {
				element?.classList.add('disable_class');
			} else {
				element?.classList.remove('disable_class');
				element?.classList.remove('even_color');
				element?.classList.remove('odd_color');
				if (element) {
					element.innerText = ''
				}
			}
		});

		if (value === 'enable') {
			strip_hrz?.classList.remove('hrz_win_strip_animation', 'top_box_match', 'middle_box_match', 'bottom_box_match');
			strip_vrt?.classList.remove('vrt_win_strip_animation', 'leftmost_box_match', 'rightmost_box_match', 'middlevertical_box_match');
			strip_cross?.classList.remove('cross_win_strip_animation', 'ltr_cross', 'rtl_cross');
		}
	}

	confetti(event?: any) {
		let element = document.getElementById('confetti-container');
		if (element) {
			party.confetti(element, {
				count: 200,
				size: 1.5,
				shapes: ["star", "roundedSquare"],
			});
		}
	}

	reset(value?: any) {
		this.counter = 1;
		this.odd_clicked = [];
		this.even_clicked = [];
		this.winner = '';
		this.next_player = `${this.player_1} (X)`;
		this.toggleClasses('enable');

		if (value) {
			this.player_1_wins = 0;
			this.player_2_wins = 0;
			this.current_round = 1;
			this.rounds = 0;
			this.draw_matches = 0;
		}
	}

	playAgain() {
		this.reset('play_again');
		this.openDialog();
	}
}
