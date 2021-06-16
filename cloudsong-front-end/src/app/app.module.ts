import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit.component';
import { appRoutingProviders } from './app-routing.module';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent} from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component'; 
import { AlbumDetailComponent } from './components/album-detail.component';
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { PlayerComponent } from './components/player.component';
import { PlaylistAddComponent } from './components/playlist-add.component';
import { BibliotecaComponent } from './components/biblioteca.component';
import { PlaylistDetailComponent } from './components/playlist-detail.component';
import { SearchComponent } from './components/search.component';
import { FilterPipe } from './components/pipe/filter.pipe';
import { PlaylistEditComponent } from './components/playlist-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistListComponent,
    HomeComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent,
    PlaylistAddComponent,
    BibliotecaComponent,
    PlaylistDetailComponent,
    PlaylistEditComponent,
    SearchComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    appRoutingProviders
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
