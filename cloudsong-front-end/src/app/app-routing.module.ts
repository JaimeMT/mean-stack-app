import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { PlaylistAddComponent } from './components/playlist-add.component';
import { BibliotecaComponent } from './components/biblioteca.component';
import { PlaylistDetailComponent } from './components/playlist-detail.component';
import { SearchComponent } from './components/search.component';
import { PlaylistEditComponent } from './components/playlist-edit.component';

const appRoutes: Routes = [

  { path: 'mis-datos', component: UserEditComponent },
  { path: 'search', component: SearchComponent },
  { path: 'edit-artist/:id', component: ArtistEditComponent },
  { path: 'artist/:id', component: ArtistDetailComponent },
  { path: 'home', component: HomeComponent },
  { path: 'add-artist', component: ArtistAddComponent },
  { path: 'artists/:page', component: ArtistListComponent },
  { path: 'add-album/:artist', component: AlbumAddComponent },
  { path: 'edit-album/:id', component: AlbumEditComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: 'add-song/:album', component: SongAddComponent },
  { path: 'edit-song/:id', component: SongEditComponent },
  { path: 'crear-playlist/:id', component: PlaylistAddComponent },
  { path: 'mi-biblioteca/:id', component: BibliotecaComponent },
  { path: 'playlist/:id', component:PlaylistDetailComponent},
  { path: 'edit-playlist/:id', component:PlaylistEditComponent},

  { path: '**', component: HomeComponent },
  
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const appRoutingProviders: any[] = [];

